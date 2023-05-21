﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Memoria.DataService.Data;
using Memoria.Entities.DbSet;
using Memoria.DataService.IConfiguration;
using AutoMapper;
using Newtonsoft.Json;
using Memoria.Entities.DTOs.Outgoing;
using Memoria.Entities.DTOs.Incomming;
using MemoriaMVC.ViewModel.Attachment;

namespace MemoriaMVC.Controllers
{
    public class AttachmentsController : BaseController<AttachmentsController>
    {
        public AttachmentsController(IUnitOfWork unitOfWork, IMapper mapper, ILogger<AttachmentsController> logger) : base(unitOfWork, mapper, logger)
        {
        }


        // get all attachments previews 
        [HttpGet]
        public async Task<IActionResult> AllAttachmentPreview([FromQuery] string noteIds)
        {
            var noteIdsArray = JsonConvert.DeserializeObject<string[]>(noteIds);
            var attchmentPreviews = await _unitOfWork.Attachments.GetFirstOneByIds(noteIdsArray);
            return Json(attchmentPreviews);
        }


        [HttpGet]
        public async Task<IActionResult> AttachmentAllForANote([FromQuery] string noteId) 
        {
              var allAttachments = await _unitOfWork.Attachments.GetAllAttachmentForANote(noteId);
            return Json(allAttachments);
        }


        [HttpPost]
        public async Task<IActionResult> AddAttachment()
        {
            var file = Request.Form.Files[0];
            string attachMentMetaDataString = Request.Form["attachmentMetaData"];

            if(file == null)
            {
                throw new ArgumentNullException(nameof(file));
            } 
            if(attachMentMetaDataString == null)
            {
                throw new ArgumentNullException(attachMentMetaDataString, nameof(attachMentMetaDataString));
            }

            var attachmentMetaData = JsonConvert.DeserializeObject<AttachmentViewModel>(attachMentMetaDataString);

            var attchmentDto = _mapper.Map<AttachmentSingleInDTO>(attachmentMetaData);

            // auto clearing memory via disposable object
            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                attachmentMetaData.file = memoryStream.ToArray();
            }

            var attachmentMetaDataDto = _mapper.Map<AttachmentSingleInDTO>(attachmentMetaData);
            // now add to the database
            string attachmentId = await _unitOfWork.AddAttachmentAsync(attachmentMetaDataDto);

            return Json(attachmentId);
        }


        [HttpDelete]
        public async Task<IActionResult> Delete(string id)
        {
            await _unitOfWork.Attachments.Delete(id);
            return Json(null);
        }

        /*
        // GET: Attachments/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null || _unitOfWork.Attachments == null)
            {
                return NotFound();
            }

            var attachment = await _unitOfWork.Attachments
                .Include(a => a.User)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (attachment == null)
            {
                return NotFound();
            }

            return View(attachment);
        }

        // POST: Attachments/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.

        // GET: Attachments/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null || _unitOfWork.Attachments == null)
            {
                return NotFound();
            }

            var attachment = await _unitOfWork.Attachments.FindAsync(id);
            if (attachment == null)
            {
                return NotFound();
            }
            ViewData["UserId"] = new SelectList(_unitOfWork.Users, "Id", "Id", attachment.UserId);
            return View(attachment);
        }

        // POST: Attachments/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("NoteId,ContentType,ContentSize,Content,UserId,Id,Status,AddedDateAndTime,UpdatedDateAndTime,UpdatedBy,AddedBy,FileFormat")] Attachment attachment)
        {
            if (id != attachment.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _unitOfWork.Update(attachment);
                    await _unitOfWork.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AttachmentExists(attachment.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["UserId"] = new SelectList(_unitOfWork.Users, "Id", "Id", attachment.UserId);
            return View(attachment);
        }

        // GET: Attachments/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null || _unitOfWork.Attachments == null)
            {
                return NotFound();
            }

            var attachment = await _unitOfWork.Attachments
                .Include(a => a.User)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (attachment == null)
            {
                return NotFound();
            }

            return View(attachment);
        }

        // POST: Attachments/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            if (_unitOfWork.Attachments == null)
            {
                return Problem("Entity set 'AppDbContext.Attachments'  is null.");
            }
            var attachment = await _unitOfWork.Attachments.FindAsync(id);
            if (attachment != null)
            {
                _unitOfWork.Attachments.Remove(attachment);
            }
            
            await _unitOfWork.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AttachmentExists(string id)
        {
          return (_unitOfWork.Attachments?.Any(e => e.Id == id)).GetValueOrDefault();
        }

        */
    }
}

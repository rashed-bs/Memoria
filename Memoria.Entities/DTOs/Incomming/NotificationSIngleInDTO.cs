﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Memoria.Entities.DTOs.Incomming
{
    public class NotificationSIngleInDTO
    {
        public string SenderId { get; set; }

        public string ReceiverId { get; set; }

        public string Content { get; set; }

        public string link { get; set; }

        public string NoticeState { get; set; }

        public bool IsSent { get; set; }
    }
}

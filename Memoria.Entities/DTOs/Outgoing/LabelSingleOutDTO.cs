﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Memoria.Entities.DTOs.Outgoing
{
    public class LabelSingleOutDTO : BaseDTO
    {
        public string Content { get; set; }

        public string LabelerId { get; set; }
    }
}

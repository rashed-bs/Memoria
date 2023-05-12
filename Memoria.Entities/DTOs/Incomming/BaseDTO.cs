﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Memoria.Entities.DTOs.Incomming
{
    public class BaseDTO
    {
        public DateTime UpdatedDateAndTime { get; set; }
        public string UpdatedBy { get; set; }
        public string AddedBy { get; set; }
        public string? FileFormat { get; set; }
    }
}

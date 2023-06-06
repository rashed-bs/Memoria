﻿namespace MemoriaMVC.SocketConnections.Models.Outgoing
{
    public class NotificationSingleOutModel
    {
        public string Id { get; set; }
        public int Status { get; set; } = 1;
        public DateTime? AddedDateAndTime { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedDateAndTime { get; set; } = DateTime.UtcNow;
        public string? UpdatedBy { get; set; }
        public string? AddedBy { get; set; }
        public string? FileFormat { get; set; }
        public string SenderId { get; set; }

        public string ReceiverId { get; set; }

        public string Content { get; set; }

        public string link { get; set; }

        public string NoticeState { get; set; }

        public bool IsSent { get; set; }
    }
}

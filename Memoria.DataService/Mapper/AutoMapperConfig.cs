﻿using AutoMapper;
using Memoria.Entities.DbSet;
using Memoria.Entities.DTOs.Incomming;
using Memoria.Entities.DTOs.Outgoing;

namespace Memoria.DataService.Mapper
{
    public static class AutoMapperConfig
    {
        public static IMapper Configure()
        {
            var mapperConfiguration = new MapperConfiguration(cfg => {
                cfg.CreateMap<UserSingleInDTO, User>();
                cfg.CreateMap<User, UserSingleOutDTO>();
                cfg.CreateMap<Label, LabelSingleOutDTO>();
                cfg.CreateMap<LabelSingleInDTO, Label>();
                cfg.CreateMap<UserSingleOutDTO, User>();
                cfg.CreateMap<UserSingleOutDTO, UserSingleInDTO>();
                cfg.CreateMap<Note, NoteSingleOutDTO>();
                cfg.CreateMap<NoteSingleInDTO, Note>();
                cfg.CreateMap<Note, NoteSingleOutDTO>();
                cfg.CreateMap<AttachmentSingleInDTO, Attachment>();
                cfg.CreateMap<Attachment, AttachmentSingleOutDTO>()
                .ForMember(dest => dest.fileBase64, opt => opt.MapFrom(src => ConvertToString(src.file)));
                cfg.CreateMap<User, UserCollaboratorSearchResultDto>()
                .ForMember(dest => dest.fileBase64, opt => opt.MapFrom(src => ConvertToString(src.Image)));
                cfg.CreateMap<User, UserDetailsSingleOutDTO>()
                .ForMember(dest => dest.fileBase64, opt => opt.MapFrom(src => ConvertToString(src.Image)));
                cfg.CreateMap<RefreshTokenSingleInDTO, RefreshToken>();
                cfg.CreateMap<RefreshToken, RefreshTokenSingleOutDTO>();
                cfg.CreateMap<RefreshTokenSingleOutDTO, RefreshToken>();
                cfg.CreateMap<AuthorizationSingleInDTO, Authorization>();
                cfg.CreateMap<Authorization, AuthorizationSingleOutDTO>();
                cfg.CreateMap<CommentSingleInDTO, Comment>();
                cfg.CreateMap<Comment, CommentSingleOutDTO>();
                cfg.CreateMap<Notification, NotificationSingleOutDTO>();
                cfg.CreateMap<NotificationSIngleInDTO, Notification>();
            });

            IMapper mapper = mapperConfiguration.CreateMapper();

            return mapper;
        }

        private static string ConvertToString(byte[] bytes)
        {
            return Convert.ToBase64String(bytes);
        }
    }
}


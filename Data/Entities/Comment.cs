using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using ApiProjektas.Auth.Model;

namespace ApiProjektas.Data.Entities 
{
    public class Comment
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public DateTimeOffset CreatedAt { get; set; }

        public Post Post { get; set; }

        [Required]
        public required string UserId { get; set; }

        public ForumUser User { get; set; }


        public CommentDto ToDto()
        {
            return new CommentDto(this.Post?.Id ?? 0, Id, Content, CreatedAt);
        }
    }
}

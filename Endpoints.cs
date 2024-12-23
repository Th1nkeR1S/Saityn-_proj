using System;
using System.Linq;
using ApiProjektas.Data;
using ApiProjektas.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using SharpGrip.FluentValidation.AutoValidation.Endpoints.Extensions;
using ApiProjektas.Auth.Model;
using ApiProjektas;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

public static class Endpoints
{
    public static void AddTestApi(this WebApplication app)
    {
        app.MapGet("/api/test", async (ProjectDb dbContext) =>
        {
            try
            {
                var topics = await dbContext.Topics.ToListAsync();
                return Results.Ok(topics);
            }
            catch (Exception ex)
            {
                return Results.Problem("Database connection failed: " + ex.Message);
            }
        });
    }

    public static void AddTopicsApi(this WebApplication app)
    {
        var topicsGroups = app.MapGroup("/api").AddFluentValidationAutoValidation();

        topicsGroups.MapGet("/topics", async (ProjectDb dbContext) =>
        {
            var topics = await dbContext.Topics.ToListAsync();
            return topics.Select(topic => topic.ToDto());
        });

        topicsGroups.MapPost("/topics", [Authorize(Roles = ForumRoles.ForumUser)] async (CreateOrUpdateTopicDto dto, ProjectDb dbContext, LinkGenerator linkGenerator, HttpContext httpContext) =>
        {
            var topic = new Topic { Title = dto.Title, Description = dto.Description, CreatedAt = DateTimeOffset.UtcNow,
                UserId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub)};
            dbContext.Topics.Add(topic);
            await dbContext.SaveChangesAsync();

            return Results.Created($"api/topics/{topic.Id}", topic.ToDto());
        });

        topicsGroups.MapGet("/topics/{topicId}", async (int topicId, ProjectDb dbContext) =>
        {
            var topic = await dbContext.Topics.FindAsync(topicId);
            if (topic == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(topic.ToDto());
        });

        topicsGroups.MapPut("/topics/{topicId}", [Authorize] async (CreateOrUpdateTopicDto dto, int topicId, HttpContext httpContext, ProjectDb dbContext) =>
        {
            var topic = await dbContext.Topics.FindAsync(topicId);
            if (topic == null)
            {
                return Results.NotFound();
            }

            if (!httpContext.User.IsInRole(ForumRoles.Admin) &&
                httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub) != topic.UserId)
            {
                return Results.Forbid();
            }

            topic.Title = dto.Title;
            topic.Description = dto.Description;
            dbContext.Topics.Update(topic);
            await dbContext.SaveChangesAsync();

            return Results.Ok(topic.ToDto());
        });

        topicsGroups.MapDelete("/topics/{topicId}", async (int topicId, ProjectDb dbContext) =>
        {
            var topic = await dbContext.Topics.FindAsync(topicId);
            if (topic == null)
            {
                return Results.NotFound();
            }

            dbContext.Topics.Remove(topic);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }

    public static void AddPostsApi(this WebApplication app)
    {
        var postsGroups = app.MapGroup("/api/topics/{topicId}").AddFluentValidationAutoValidation();

        postsGroups.MapGet("/posts", async (int topicId, ProjectDb dbContext) =>
        {
            var topic = await dbContext.Topics.FindAsync(topicId);
            if (topic == null)
            {
                return Results.NotFound();
            }

            var posts = await dbContext.Posts.Where(post => post.Topic.Id == topicId).ToListAsync();
            return Results.Ok(posts.Select(post => post.ToDto()));
        });

        postsGroups.MapPost("/posts", async (int topicId, CreateOrUpdatePostDto dto, ProjectDb dbContext, HttpContext httpContext) =>
        {
            var topic = await dbContext.Topics.FindAsync(topicId);
            if (topic == null)
            {
                return Results.NotFound();
            }

            var userId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            var post = new Post { Title = dto.Title, Body = dto.Body, CreatedAt = DateTimeOffset.UtcNow, Topic = topic, UserId = userId };

            dbContext.Posts.Add(post);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/api/topics/{topicId}/posts/{post.Id}", post.ToDto());
        });

        postsGroups.MapGet("/posts/{postId}", async (int topicId, int postId, ProjectDb dbContext) =>
        {
            var posts = dbContext.Posts.Include(post => post.Topic);
            var post = await posts.FirstOrDefaultAsync(post => post.Id == postId && post.Topic.Id == topicId);
            if (post == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(post.ToDto());
        });

        postsGroups.MapPut("/posts/{postId}", async (int topicId, int postId, CreateOrUpdatePostDto dto, ProjectDb dbContext) =>
        {
            var posts = dbContext.Posts.Include(post => post.Topic);
            var post = await posts.FirstOrDefaultAsync(post => post.Id == postId && post.Topic.Id == topicId);
            if (post == null)
            {
                return Results.NotFound();
            }

            post.Title = dto.Title;
            post.Body = dto.Body;
            dbContext.Posts.Update(post);
            await dbContext.SaveChangesAsync();

            return Results.Ok(post.ToDto());
        });

        postsGroups.MapDelete("/posts/{postId}", async (int topicId, int postId, ProjectDb dbContext) =>
        {
            var posts = dbContext.Posts.Include(post => post.Topic);
            var post = await posts.FirstOrDefaultAsync(post => post.Id == postId && post.Topic.Id == topicId);
            if (post == null)
            {
                return Results.NotFound();
            }

            dbContext.Posts.Remove(post);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }

    public static void AddCommentsApi(this WebApplication app)
    {
        var commentsGroups = app.MapGroup("/api/topics/{topicId}/posts/{postId}").AddFluentValidationAutoValidation();

        commentsGroups.MapGet("/comments", async (int topicId, int postId, ProjectDb dbContext) =>
        {
            var post = await dbContext.Posts.Include(p => p.Topic).FirstOrDefaultAsync(p => p.Id == postId && p.Topic.Id == topicId);

            if (post == null)
            {
                return Results.NotFound();
            }

            var comments = await dbContext.Comments.Where(c => c.Post.Id == postId).ToListAsync();
            return Results.Ok(comments.Select(comment => comment.ToDto()));
        });

        commentsGroups.MapPost("/comments", async (int topicId, int postId, CreateOrUpdateCommentDto dto, ProjectDb dbContext, HttpContext httpContext) =>
        {
            var post = await dbContext.Posts.Include(p => p.Topic).FirstOrDefaultAsync(p => p.Id == postId && p.Topic.Id == topicId);
            if (post == null)
            {
                return Results.NotFound();
            }

            var userId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);

            var comment = new Comment
            {
                Content = dto.Content,
                CreatedAt = DateTimeOffset.UtcNow,
                UserId = userId,
                Post = post
            };

            dbContext.Comments.Add(comment);
            await dbContext.SaveChangesAsync();

            return Results.Created($"/api/topics/{topicId}/posts/{postId}/comments/{comment.Id}", comment.ToDto());
        });

        commentsGroups.MapGet("/comments/{commentId}", async (int topicId, int postId, int commentId, ProjectDb dbContext) =>
        {
            var comment = await dbContext.Comments
                .Include(c => c.Post)
                .ThenInclude(p => p.Topic)
                .FirstOrDefaultAsync(c => c.Id == commentId && c.Post.Id == postId && c.Post.Topic.Id == topicId);

            if (comment == null)
            {
                return Results.NotFound();
            }

            return Results.Ok(comment.ToDto());
        });

        commentsGroups.MapPut("/comments/{commentId}", async (int topicId, int postId, int commentId, CreateOrUpdateCommentDto dto, ProjectDb dbContext, HttpContext httpContext) =>
        {
            var comment = await dbContext.Comments
                .Include(c => c.Post)
                .ThenInclude(p => p.Topic)
                .FirstOrDefaultAsync(c => c.Id == commentId && c.Post.Id == postId && c.Post.Topic.Id == topicId);

            if (comment == null)
            {
                return Results.NotFound();
            }

            var userId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (comment.UserId != userId && !httpContext.User.IsInRole(ForumRoles.Admin))
            {
                return Results.Forbid();
            }

            comment.Content = dto.Content;
            dbContext.Comments.Update(comment);
            await dbContext.SaveChangesAsync();

            return Results.Ok(comment.ToDto());
        });

        commentsGroups.MapDelete("/comments/{commentId}", async (int topicId, int postId, int commentId, ProjectDb dbContext, HttpContext httpContext) =>
        {
            var comment = await dbContext.Comments
                .Include(c => c.Post)
                .ThenInclude(p => p.Topic)
                .FirstOrDefaultAsync(c => c.Id == commentId && c.Post.Id == postId && c.Post.Topic.Id == topicId);

            if (comment == null)
            {
                return Results.NotFound();
            }

            var userId = httpContext.User.FindFirstValue(JwtRegisteredClaimNames.Sub);
            if (comment.UserId != userId && !httpContext.User.IsInRole(ForumRoles.Admin))
            {
                return Results.Forbid();
            }

            dbContext.Comments.Remove(comment);
            await dbContext.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}

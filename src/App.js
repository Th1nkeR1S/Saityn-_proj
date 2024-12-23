import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Modal from './Components/Modal';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Pages/Login';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:5133/api',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json',
    }
});

const App = () => {
    const [topics, setTopics] = useState([]);
    const [expandedTopicId, setExpandedTopicId] = useState(null);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const [expandedCommentId, setCommentPostId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [posts, setPosts] = useState({});
    const [comments, setComments] = useState({});

    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('accessToken') !== null;

    const topicTitleRef = useRef(null);
    const topicDescriptionRef = useRef(null);
    const postTitleRef = useRef(null);
    const postBodyRef = useRef(null);
    const commentContentRef = useRef(null);

    // Extract userId from the token
    const userID = isLoggedIn ? jwtDecode(localStorage.getItem('accessToken')).sub : null;

    useEffect(() => {
        const loadTopics = async () => {
            try {
                const response = await axiosInstance.get('/topics');
                setTopics(response.data);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        if (isLoggedIn) {
            loadTopics();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <Login />;
    }

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        navigate('/login');
    };

    const TopicList = () => {
        const loadPosts = async (topicId) => {
            try {
                const response = await axiosInstance.get(`/topics/${topicId}/posts`);
                setPosts((prev) => ({ ...prev, [topicId]: response.data }));
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        const loadComments = async (topicId, postId) => {
            try {
                const response = await axiosInstance.get(`/topics/${topicId}/posts/${postId}/comments`);
                setComments((prev) => ({
                    ...prev,
                    [postId]: response.data,
                }));
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        const handleCreateTopic = async (e) => {
            e.preventDefault();
            try {
                const newTopicData = {
                    title: topicTitleRef.current.value,
                    description: topicDescriptionRef.current.value,
                    userId: userID, 
                };
                const response = await axiosInstance.post('/topics', newTopicData);
                setTopics((prev) => [...prev, response.data]);
                topicTitleRef.current.value = '';
                topicDescriptionRef.current.value = '';
                setModalVisible(false); // Close modal after submitting
            } catch (error) {
                console.error('Error creating topic:', error);
            }
        };

        const handleEditTopic = async (topicId, e) => {
          e.preventDefault();
      
          const updatedTopicData = {
              title: topicTitleRef.current.value,
              description: topicDescriptionRef.current.value,
          };
      
          try {
              const response = await axiosInstance.put(`/topics/${topicId}`, updatedTopicData);
              setTopics((prev) =>
                  prev.map((topic) => (topic.id === topicId ? response.data : topic))
              );
              setExpandedTopicId(null); // Close edit mode
          } catch (error) {
              console.error('Error editing topic:', error);
          }
      };

        const handleDeleteTopic = async (topicId) => {
          try {
              await axiosInstance.delete(`/topics/${topicId}`);
              setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
          } catch (error) {
              console.error('Error deleting topic:', error);
          }
      };

        const handleCreatePost = async (topicId, e) => {
            e.preventDefault();

            const newPostData = {
                title: postTitleRef.current.value,
                body: postBodyRef.current.value,
                userId: userID,
            };

            try {
                const response = await axiosInstance.post(`/topics/${topicId}/posts`, newPostData);
                setPosts((prev) => ({
                    ...prev,
                    [topicId]: [...(prev[topicId] || []), response.data],
                }));

                postTitleRef.current.value = '';
                postBodyRef.current.value = '';
            } catch (error) {
                console.error('Error creating post:', error);
            }
        };

        const handleEditPost = async (topicId, postId, e) => {
          e.preventDefault();
      
          const updatedPostData = {
              title: postTitleRef.current.value,
              body: postBodyRef.current.value,
          };
      
          try {
              const response = await axiosInstance.put(`/topics/${topicId}/posts/${postId}`, updatedPostData);
              setPosts((prev) => ({
                  ...prev,
                  [topicId]: prev[topicId].map((post) =>
                      post.id === postId ? response.data : post
                  ),
              }));
          } catch (error) {
              console.error('Error editing post:', error);
          }
      };

        const handleDeletePost = async (topicId, postId) => {
          try {
              await axiosInstance.delete(`/topics/${topicId}/posts/${postId}`);
              setPosts((prev) => ({
                  ...prev,
                  [topicId]: prev[topicId].filter((post) => post.id !== postId),
              }));
          } catch (error) {
              console.error('Error deleting post:', error);
          }
      };


        const handleCreateComment = async (topicId, postId, e) => {
            e.preventDefault();
            try {
                const newCommentData = {
                    content: commentContentRef.current.value,
                    userId: userID,
                };
                const response = await axiosInstance.post(
                    `/topics/${topicId}/posts/${postId}/comments`,
                    newCommentData
                );
                setComments((prev) => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), response.data],
                }));
                commentContentRef.current.value = '';
            } catch (error) {
                console.error('Error creating comment:', error);
            }
        };

        const handleEditComment = async (topicId, postId, commentId, e) => {
          e.preventDefault();
      
          const updatedCommentData = {
              content: commentContentRef.current.value,
          };
      
          try {
              const response = await axiosInstance.put(
                  `/topics/${topicId}/posts/${postId}/comments/${commentId}`,
                  updatedCommentData
              );
              setComments((prev) => ({
                  ...prev,
                  [postId]: prev[postId].map((comment) =>
                      comment.id === commentId ? response.data : comment
                  ),
              }));
          } catch (error) {
              console.error('Error editing comment:', error);
          }
      };

        const handleDeleteComment = async (topicId, postId, commentId) => {
          try {
              await axiosInstance.delete(`/topics/${topicId}/posts/${postId}/comments/${commentId}`);
              setComments((prev) => ({
                  ...prev,
                  [postId]: prev[postId].filter((comment) => comment.id !== commentId),
              }));
          } catch (error) {
              console.error('Error deleting comment:', error);
          }
      };

      const handleEditClick = (topicId) => {
        setExpandedTopicId(topicId); 
    };
    const handlePostEditClick = (topicId, postId) => {
      setExpandedPostId(postId); 
    };
    const handleCommentEditClick = (topicId, postId,commentId) => {
      setCommentPostId(commentId); 
    };


        return (
            <div className="App">
                <Header />
                <div className="content">
                    <h1>Topics List</h1>

                    <button onClick={handleLogout} className="logout-btn">Logout</button>

                    {/* Button to open the modal */}
                    <button onClick={() => setModalVisible(true)} className="create-topic-btn">
                        Create New Topic
                    </button>

                    {/* Modal for creating a topic */}
                    {modalVisible && (
                        <Modal>
                            <h2>Create New Topic</h2>
                            <form onSubmit={handleCreateTopic} className="topic-form">
                                <input
                                    type="text"
                                    ref={topicTitleRef}
                                    placeholder="Topic Title"
                                    required
                                />
                                <textarea
                                    ref={topicDescriptionRef}
                                    placeholder="Topic Description"
                                    required
                                ></textarea>
                                <button type="submit">Add Topic</button>
                                <button
                                    type="button"
                                    onClick={() => setModalVisible(false)}
                                    className="close-modal-btn"
                                >
                                    Close
                                </button>
                            </form>
                        </Modal>
                    )}

                    {topics.length > 0 ? (
                        <div className="topic-list">
                            {topics.map((topic) => (
                                <div className="topic-item" key={topic.id}>
                                    <h2>{topic.title}</h2>
                                    <p>{topic.description}</p>
                                    <button onClick={() => handleDeleteTopic(topic.id)}>Delete</button>
                                    <button onClick={() => handleEditClick(topic.id)}>Edit</button>
                                    {expandedTopicId === topic.id && (
                                    <form onSubmit={(e) => handleEditTopic(topic.id, e)} className="edit-topic-form">
                                        <input
                                            type="text"
                                            ref={topicTitleRef}
                                            defaultValue={topic.title}
                                            required
                                        />
                                        <textarea
                                            ref={topicDescriptionRef}
                                            defaultValue={topic.description}
                                            required
                                        ></textarea>
                                        <button type="submit">Save Changes</button>
                                        <button type="button" onClick={() => setExpandedTopicId(null)}>
                                            Cancel
                                        </button>
                                    </form>
                                )}
                                    <button
                                        onClick={() => {
                                            setExpandedTopicId((prev) =>
                                                prev === topic.id ? null : topic.id
                                            );
                                            loadPosts(topic.id);
                                        }}
                                    >
                                        {expandedTopicId === topic.id ? 'Hide Details' : 'Show Posts'}
                                    </button>
                                    {expandedTopicId === topic.id && posts[topic.id] && (
                                        <div className="posts">
                                            <h3>Posts:</h3>
                                            <form onSubmit={(e) => handleCreatePost(topic.id, e)}>
                                                <input
                                                    type="text"
                                                    ref={postTitleRef}
                                                    placeholder="Post Title"
                                                />
                                                <textarea
                                                    ref={postBodyRef}
                                                    placeholder="Post Body"
                                                ></textarea>
                                                <button type="submit">Add Post</button>
                                            </form>
                                            {posts[topic.id].length > 0 ? (
                                                posts[topic.id].map((post) => (
                                                    <div className="post-item" key={post.id}>
                                                        <h4>{post.title}</h4>
                                                        <p>{post.body}</p>
                                                        <button onClick={() => handleDeletePost(topic.id, post.id)}>Delete Post</button>
                                                        <button onClick={() => handlePostEditClick(topic.id, post.id)}>Edit Post</button>
    {expandedPostId === post.id && (
      <form onSubmit={(e) => handleEditPost(topic.id, post.id, e)} className="edit-post-form">
          <input
              type="text"
              ref={postTitleRef}
              defaultValue={post.title}
              required
          />
          <textarea
              ref={postBodyRef}
              defaultValue={post.body}
              required
          ></textarea>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => setExpandedPostId(null)}>
              Cancel
          </button>
      </form>
  )}

                                                        <button
                                                            onClick={() => loadComments(topic.id, post.id)}
                                                        >
                                                            Show Comments
                                                        </button>
                                                        {comments[post.id] && (
    <div className="comments">
        <h5>Comments:</h5>
        <form
            onSubmit={(e) => handleCreateComment(topic.id, post.id, e)}
        >
            <input
                type="text"
                ref={commentContentRef}
                placeholder="Comment Content"
            />
            <button type="submit">Add Comment</button>
        </form>
        {comments[post.id].length > 0 ? (
            comments[post.id].map((comment) => (
                <div key={comment.id} className="comment-item">
                    <p>{comment.content}</p>
                    <button
                        onClick={() =>
                            handleDeleteComment(topic.id, post.id, comment.id)
                            
                        }
                    >
                        Delete Comment
                    </button>
                    <button
                        onClick={() =>
                          handleCommentEditClick(topic.id, post.id, comment.id)
                        }
                    >
                        Edit Comment
                    </button>
                    
                    {expandedCommentId === comment.id && (
  <form onSubmit={(e) => handleEditComment(topic.id, post.id, comment.id, e)} className="edit-comment-form">
    <input
      type="text"
      ref={commentContentRef}
      defaultValue={comment.content}
      required
    />
    <button type="submit">Save Changes</button>
    <button type="button" onClick={() => setCommentPostId(null)}>
      Cancel
    </button>
  </form>
)}
                </div>
                
            ))
        ) : (
            <p>No comments available.</p>
        )}
    </div>
)}
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No posts available.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Loading topics...</p>
                    )}
                </div>
                <Footer />
            </div>
        );
    };

    return (
        <Routes>
            <Route path="/" element={<TopicList />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default App;

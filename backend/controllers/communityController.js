import CommunityPost from "../models/CommunityPost.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, images } = req.body;
    const newPost = new CommunityPost({
      userId: req.user?.userId, // assuming you have user from auth middleware
      
      title,
      content,
      images
    });

    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Like/Unlike post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({ success: true, likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;

    const post = await CommunityPost.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    post.comments.push({
      userId: req.user._id,
      comment
    });

    await post.save();
    res.status(200).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

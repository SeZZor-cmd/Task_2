import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://hn.algolia.com/api/v1/items/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post', error);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Link to="/">Back to Posts</Link>
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </div>
  );
};

export default PostDetail;

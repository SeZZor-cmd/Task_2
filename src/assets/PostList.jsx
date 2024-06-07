import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = 'https://hn.algolia.com/api/v1/search_by_date?tags=story&page=';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const intervalId = useRef(null);

  const fetchPosts = async (pageNum) => {
    try {
      setLoading(true);
      console.log(`Fetching page ${pageNum}`);
      const result = await axios.get(API_URL + pageNum);
      console.log('Fetched posts:', result.data.hits);
      setPosts(prevPosts => [...prevPosts, ...result.data.hits]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setPage(prevPage => prevPage + 1);
    }, 10000);

    return () => clearInterval(intervalId.current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        clearInterval(intervalId.current); // Stop periodic fetching when user scrolls to bottom
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <h1>Hacker News Posts</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>URL</th>
            <th>Created At</th>
            <th>Author</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => (
            <tr key={post.objectID}>
              <td><Link to={`/post/${post.objectID}`}>{post.title}</Link></td>
              <td><a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a></td>
              <td>{new Date(post.created_at).toLocaleString()}</td>
              <td>{post.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div>Loading...</div>}
    </div>
  );
};

export default PostList;

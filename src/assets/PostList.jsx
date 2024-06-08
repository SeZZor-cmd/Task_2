import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [newPage, setNewPage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${page}`);
      const fetchedPosts = response.data.hits;
      setPosts(prevPosts => [...prevPosts, ...fetchedPosts]);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  }, [page]);

  const fetchNewPosts = useCallback(async () => {
    try {
      const response = await axios.get(`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=0`);
      const fetchedPosts = response.data.hits;
      if (fetchedPosts.length > 0) {
        setNewPage(fetchedPosts);
      }
    } catch (error) {
      console.error('Error fetching new posts', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const intervalId = setInterval(fetchNewPosts, 10000);
    return () => clearInterval(intervalId);
  }, [fetchPosts, fetchNewPosts]);

  useEffect(() => {
    if (newPage) {
      setPage(prevPage => prevPage + 1);
      setPosts(prevPosts => [...prevPosts, ...newPage]);
      navigate(`/?page=${page + 1}`);
      setNewPage(null);
    }
  }, [newPage, page, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentPage = parseInt(queryParams.get('page')) || 0;
    setPage(currentPage);
  }, [location]);

  const handleScroll = (e) => {
    if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setPage(prevPage => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentPagePosts = posts.slice(page * 15, (page + 1) * 15);

  return (
    <div>
      
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
          {currentPagePosts.map((post) => (
            <tr key={post.objectID}>
              <td><Link to={`/post/${post.objectID}`}>{post.title}</Link></td>
              <td><a href={post.url} target="_blank" rel="noopener noreferrer">{post.url}</a></td>
              <td>{new Date(post.created_at).toLocaleString()}</td>
              <td>{post.author}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;

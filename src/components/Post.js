import React from "react";
import Card from "react-bootstrap/Card";
import { GrEdit } from "react-icons/gr";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date().toLocaleDateString(undefined, options);

  return (
    <Card className='card'>
      <Card.Body>
        <Card.Title>
          <span className='postDate'>{date}</span>
          <h3>{post.title}</h3>
          <Link
            className='editPostBtn'
            to={{ pathname: `/edit/${post.id}`, state: { post } }}
          >
            <GrEdit />
          </Link>
        </Card.Title>
        <Card.Text>{post.body}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Post;

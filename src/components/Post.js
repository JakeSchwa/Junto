import React from "react";
import Card from "react-bootstrap/Card";
import { GrEdit } from "react-icons/gr";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <Card style={{ padding: "10px" }}>
      <Link to={{ pathname: `/edit/${post.id}`, state: { post } }}>
        <GrEdit />
      </Link>
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.body}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Post;

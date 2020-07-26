import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { GrEdit } from "react-icons/gr";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  return (
    <Card className="card">
      <Card.Body>
        <Card.Title>
          <h3>
            {post.title}
          </h3>
          <Link className="editPostBtn" to={{ pathname: `/edit/${post.id}`, state: { post } }}>
            <GrEdit />
          </Link>
        </Card.Title>
        <Card.Text>{post.body}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Post;

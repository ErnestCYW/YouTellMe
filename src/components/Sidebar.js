import React, { useState, useEffect } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
//import { useHistory} from "react-router-dom";
import { db } from "../firebase";

export default function Sidebar() {
  //const [error, setError] = useState("");
  const { currentUser} = useAuth();
  //const history = useHistory();
  const [user, setUser] = useState({})


  async function fetchEvents() {
    console.log(currentUser.email)
    const userDocRef = db.collection('users').doc(currentUser.email);
    await userDocRef.get().then((doc) => {
      setUser(doc.data())
    });
  }

  const renderPersonality = () => {
    return(
      <div>
        <strong>Personality: </strong>
        {user.personality? <strong>user.personality</strong> :
          <Button variant="primary" href="https://www.16personalities.com/free-personality-test" target="_blank">
          Take Quiz
        </Button>
        }
      </div>
    )
  }

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ListGroup className="w-100 mb-5">
        <ListGroup.Item>
          {renderPersonality()}
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Badges: {user.badges ? (user.badges.map(
              badge => {
                  return (
                      <div>{badge}</div>
                  )
              }
          )): null}</strong>
        </ListGroup.Item>

        <ListGroup.Item>
          <strong>Interests: {user.interests}</strong>
        </ListGroup.Item>
      </ListGroup>
    </>
  );
}

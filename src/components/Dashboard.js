import React, { useState , useEffect } from "react";
import { Button, Card, Container } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal'
//import { useAuth } from "../contexts/AuthContext";
//import { useHistory } from "react-router-dom";
import Sidebar from "./Sidebar";

import { db } from "../firebase";

export default function Dashboard() {
  //const { currentUser } = useAuth();

  const [show, setShow] = useState(false);
  const [confirmation, setConfirmation] = useState(false)
  const [orgInfo, setOrgInfo] = useState([])
  const [info, setInfo] = useState({})

  const hideConfirmation = () => {
    setConfirmation(false)
  }

  const sendConfirmation = () => {
    setShow(false)
    setConfirmation(true)
  }
  
  const showModal = (info) => {
    setInfo(info)
    setShow(true);
  }
  const hideModal = () => {
    setShow(false);
  }
  const fetchEvents = async () => {
    db.collection("organisation")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setOrgInfo(info => [...info, doc.data()])
          setInfo(doc.data())
        });
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderInfo = () => {
    return(
      <div>
        <Card.Text>Description: {info.description}</Card.Text>
        <Card.Text>No. of Candidates: {info.pax}</Card.Text>
        <Card.Text>Expected Start Date: {info.startDate}</Card.Text>
        <Card.Text>Expected End Date: {info.endDate}</Card.Text>
        <Card.Text>Prerequisites: </Card.Text>
        {info.prerequisite ? info.prerequisite.map((object) => <Card.Text>{object}</Card.Text>):null}
      </div>
    )
  }

  return (
    <div className="d-flex flex-row w-100">
      <Container className="align-self-start w-75" style={{ minHeight: "100vh" }}>
        {orgInfo.map(org => {
            return (
              <Card className='mb-3'>
                <Card.Body>
                  <Card.Title>{org.name}</Card.Title>
                  <Card.Text>Description: {org.description}</Card.Text>
                  <Card.Text>Looking for {org.pax} pax(s)</Card.Text>
                  <Button variant="primary" onClick={() => showModal(org)}>
                    Check out!
                  </Button>
                </Card.Body>
              </Card>
        )})}
      </Container>

      <Container className="w-25" style={{ minHeight: "100vh" }}>
          
          <Sidebar>
              
          </Sidebar>
      
      </Container>

      <Modal show={show} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>{info.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderInfo()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideModal}>
            Close
          </Button>
          <Button variant="primary" onClick={sendConfirmation}>
            Connect
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={confirmation} onHide={hideConfirmation}>
        <Modal.Body>You have connected with {info.name} successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideConfirmation}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
              
    </div>
  );
}

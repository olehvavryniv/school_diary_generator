import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import './App.css';
import { generatePdf } from './pdfGenerator';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [lessonPrice, setLessonPrice] = useState(1);

  const save = () => { 
    const pdfData = {
      subjectName: subjectName,
      workItems: data,
    }
    generatePdf(pdfData);
  }

  const addWorkItem = () => {
    setData([
      ...data,
      { name: "", items: [] }
    ]);
  }

  const removeWorkItem = (workItem) => {
    const newData = data.filter((item) => item !== workItem);
    setData(newData);
  }

  const addRating = (workItem) => {
    workItem.items.push({date: "", rating: ""});
    setData([...data]);
  }

  const removeRating = (workItem, index) => {
    workItem.items = workItem.items.filter((item) => item !== workItem.items[index]);
    setData([...data]);
  }

  const setWorkItemName = (workItem, name) => {
    workItem.name = name;
    setData([...data]);
  };

  const setRatingValue = (ratingItem, value) => {
    ratingItem.rating = value;
    setData([...data]);
  }

  const setRatingDate = (ratingItem, value) => {
    ratingItem.date = value;
    setData([...data]);
  }

  return (
    <Container className='my-3' fluid={true}>
      <Row>
        <Col md={6}>
          <Card className='p-3'>
            <Form.Group className="mb-3" controlId="subjectName">
              <Form.Label>Назва предмету</Form.Label>
              <Form.Control id="subjectName" type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)}/>
            </Form.Group>

            { data.map((workItem, index) => {
              return (
                <Card className="p-3 my-3">
                  <Form.Group className="">
                    <Form.Label>Назва виду роботи</Form.Label>
                    <Form.Control type="text" value={workItem.name} onChange={(e) => setWorkItemName(workItem, e.target.value)}/>
                  </Form.Group>
                  <Table bordered className='my-3'>
                    <thead>
                      <tr>
                        <th>
                          Дата
                        </th>
                        <th>
                          Бали
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      { workItem.items.map((item, index) => {
                        return(
                          <tr>
                            <td><Form.Control type="text" onChange={(e) => setRatingDate(item, e.target.value)} value={item.date}></Form.Control></td>
                            <td><Form.Control type="number" onChange={(e) => setRatingValue(item, e.target.value)} value={item.rating}></Form.Control></td>
                            <td><Button className="btn-danger" onClick={() => removeRating(workItem, index)}>X</Button></td>
                          </tr>
                        );
                      }) }
                    </tbody>
                  </Table>
                  <Row className='justify-content-center'>
                    <Col md={"auto"}>
                      <Button onClick={() => addRating(workItem)}>Додати роботу</Button>
                    </Col>
                    <Col md={"auto"}>
                      <Button className="btn-danger" onClick={() => removeWorkItem(workItem)}>Видалити вид роботи</Button>
                    </Col>
                  </Row>
                </Card>
              );
            }) }

            <Form.Group className="mb-3" controlId="lessonPrice">
              <Form.Label>Кількість балів за 1 урок</Form.Label>
              <Form.Control id="lessonPrice" type="number" value={lessonPrice} onChange={e => setLessonPrice(e.target.value)}/>
            </Form.Group>

            <Button className='my-3' onClick={addWorkItem}>Додати вид робіт</Button>
            <Button className='my-3 btn-success' onClick={save}>Згенерувати файл</Button>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;

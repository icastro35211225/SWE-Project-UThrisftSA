import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
import '../App.css';
import { Badge, Button, Card, Col, ListGroup, Row, ButtonGroup, InputGroup, ToastContainer, Toast } from "react-bootstrap";


export default function ProductScreen(props) {

    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState('');
    const [loginStatus, setLoginStatus] = useState('');
    const [count, setCount] = useState(1);
    const location = useLocation();
    //console.log(location);
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState(null);
    const [stockErrMsg, setStockErrMsg] = useState("");
    const [successShow, setSuccessShow] = useState(false);
    const [errShow, setErrShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const getUser = async () => {
        const userInfo = JSON.parse(await localStorage.getItem("userInfo"));
        //console.log(userInfo)
        if (userInfo) {
            setUser(userInfo);
            setLoginStatus(true);
        }
        //console.log(user);
    }

    const getProduct = async (ID) => {
        let tempProd = await Axios.post('http://ec2-3-93-234-9.compute-1.amazonaws.com:3000/api/getProduct', { id: ID });
        //console.log(oUser.data[0]);
        setProduct(tempProd.data[0]);
    }

    useEffect(() => {
        getUser();
        (async () => await getProduct(location.state.id))();
    }, [])

    const postProd = async () => {
        let res = await Axios.post('http://ec2-3-93-234-9.compute-1.amazonaws.com:3000/api/addToCart',
            {
                userID: user.UserID,
                productID: product.ProductID,
                productName: product.ProductName,
                productPrice: product.ProductPrice,
                productImage: product.ProductImage,
                amount: count
            }
        );
        console.log(res);
    }

    const addToCart = () => {
        if (count > product.ProductStock) {
            setStockErrMsg("Sorry, we dont have that many " + product.ProductName + "(s) available.");
            setErrShow(true);
        } else {
            postProd();
            setStockErrMsg("Added " + product.ProductName + " to cart!");
            setSuccessShow(true);
        }
    }

    const handleSubOne = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const handleAddOne = () => {
        setCount(count + 1);
    };

    return (
        <productscreen>
            <ToastContainer className="p-3" position={'top-end'} >
                <Toast show={errShow} onClose={() => setErrShow(false)} bg={'danger'} delay={5000} autohide>
                    <Toast.Header >
                        <strong className="me-auto">Error: Not enough stock</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{stockErrMsg}</Toast.Body>
                </Toast>
            </ToastContainer>
            <ToastContainer className="p-3" position={'top-end'} >
                <Toast show={successShow} onClose={() => setSuccessShow(false)} bg={'success'} delay={5000} autohide>
                    <Toast.Header >
                        <strong className="me-auto">Sucess!</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{stockErrMsg}</Toast.Body>
                </Toast>
            </ToastContainer>
            {product === null ?
                <h1>Loading Product...</h1>
                :
                <div>
                    {/* <h1>Product Name: {product.ProductName}</h1> */}

                    <Row>
                        <Col md={6}><img className="img-large"
                            src="https://i.pinimg.com/originals/c4/96/9a/c4969aaedbc096c09b35e31abd11e2ec.png"></img></Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h1>{product.ProductName}</h1>
                                </ListGroup.Item>
                                <ListGroup.Item>Price: ${product.ProductPrice}</ListGroup.Item>
                                <ListGroup.Item>
                                    Description:
                                    <p>{product.ProductDesc}</p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>${product.ProductPrice}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status: </Col>
                                                <Col>
                                                    {product.ProductStock > 0 ? (
                                                        <Badge bg="success">In Stock</Badge>
                                                    ) : (
                                                        <Badge bg="danger">Currently Out of Stock</Badge>
                                                    )}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {loginStatus ?
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>Quantity:</Col>
                                                    <Col>
                                                        <ButtonGroup aria-label="Basic example">
                                                            <Button variant="secondary" onClick={() => { handleSubOne() }}>-</Button>
                                                            <InputGroup>
                                                                <InputGroup.Text id="btnGroupAddon">{count}</InputGroup.Text>
                                                            </InputGroup>
                                                            <Button variant="secondary" onClick={() => { handleAddOne() }}>+</Button>
                                                        </ButtonGroup>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                            :
                                            null
                                        }
                                        {product.ProductStock > 0 && (
                                            <ListGroup.Item>
                                                <div className="d-grid" ref={ref}>
                                                    {loginStatus ?
                                                        <Button variant="primary" onClick={() => { addToCart() }}>
                                                            Add to Cart
                                                        </Button>
                                                        :
                                                        <Button variant="primary" onClick={() => { addToCart() }} disabled>
                                                            Log In to Add to Cart
                                                        </Button>
                                                    }
                                                </div>
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            }
        </productscreen>
    )
}

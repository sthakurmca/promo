import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';

export default function Main() {
    let [status, setStaus] = useState(1);
    let [list, setList] = useState([{}]);
    useEffect(() => {
        if (localStorage.getItem("data") === null) {
            //console.log('if');
            axios.get('https://run.mocky.io/v3/484016a8-3cdb-44ad-97db-3e5d20d84298').then((res) => {
                let data = [];
                data = res.data;
                data.sort((a, b) => {
                    return a.sequence - b.sequence;
                });
                localStorage.setItem("data", JSON.stringify(data));
                setList(data);
            }).catch((err) => {
                setList([]);
            });
        } else {
            //console.log('else');
            let mid = [];
            mid = JSON.parse(localStorage.getItem("data") || "[]");
            setList(mid);
        }
    }, []);
    const dragItem = useRef();
    const dragOverItem = useRef();

    const dragStart = (e, position) => {
        dragItem.current = position;
        //console.log(e.target.innerHTML);
    };

    const dragEnter = (e, position) => {
        dragOverItem.current = position;
        //console.log(e.target.innerHTML);
    };

    const drop = (e) => {
        const copyListItems = [...list];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        localStorage.removeItem("data");
        localStorage.setItem("data", JSON.stringify(copyListItems));
        setList(copyListItems);
    };

    return (
        <>
            <div className='container fluid text-center mt-3'>
                <div className="btn-group mx-auto " role="group" aria-label="Basic example">
                    {(status == 2) ?
                        <>
                            <button type="button" className="btn bg-transparent border mx-auto" onClick={() => { setStaus(1) }}>All Promotions </button>
                            <button type="button" className="btn btn-secondary border  mx-auto active" onClick={() => { setStaus(2) }}>New Customers</button>
                        </>
                        :
                        <>
                            <button type="button" className="btn btn-secondary border  mx-auto active" onClick={() => { setStaus(1) }}>All Promotions </button>
                            <button type="button" className="btn bg-transparent border mx-auto" onClick={() => { setStaus(2) }}>New Customers</button>
                        </>}
                </div>
            </div>
            {status == 2 ?
                list.map((res, index) => {
                    return (
                        res.onlyNewCustomers === true &&
                        <div onDragStart={(e) => dragStart(e, index)} onDragEnter={(e) => dragEnter(e, index)} onDragEnd={drop} key={index} draggable className="card mb-3 bg-light">
                            <img src='https://via.placeholder.com/600x300' style={{ width: "100%", height: "250px" }} className="card-img-top img-fluid mx-auto" alt="..." />
                            <div className="card-body">
                                <h5 className="card-title">{res.name}</h5>
                                <p className="card-text">{res.description}</p>
                                <div>
                                    <button type="button" className="btn btn-outline-secondary m-2">Terms & Conditions</button>
                                    <button type="button" className="btn btn-secondary m-2 px-5" >Join Now</button>
                                </div>
                            </div>
                        </div>
                    )
                })
                :
                list.map((res, index) => {
                    return (
                        res.onlyNewCustomers === false &&
                        <div onDragStart={(e) => dragStart(e, index)} onDragEnter={(e) => dragEnter(e, index)} onDragEnd={drop} key={index} draggable className="card p-1 mt-2 mb-2" style={{ width: "100%" }}>
                            <div className="card-body">
                                <h5 className="card-title text-start">{res.name}</h5>
                                <p className="card-text text-start">{res.description}</p>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

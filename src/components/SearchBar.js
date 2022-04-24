import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../App.css'; 

function SearchBar({placeholder, currentList}) { 
    const [allItems, setAllItems] = useState([]);
    // const [filteredList, setFilteredList] = useState([]); 

    useEffect(()=> {
        Axios.get('http://ec2-3-93-234-9.compute-1.amazonaws.com:3000/api/get').then((response)=> {
          setAllItems(response.data);
        }) 
    }, []) 

    const Filter = (event) => { 
        const searchWord = event.target.value; 
        const filteredList = []; 

        if (searchWord === "") { 
            // setFilteredList([]); 
            filteredList = allItems; 
        } 
        else { 
            /* const filterNew = allItems.filter((product) => { 
                return product.ProductName.toUpperCase().includes(searchWord.toUpperCase()); 
            });  */
            filteredList = allItems.filter((product) => { 
                return product.ProductName.toUpperCase().includes(searchWord.toUpperCase()); 
            })

            // setFilteredList(filterNew); 
        } 

        currentList = filteredList; 
    }; 

    /* {filteredList.length > 0 && ( 
        <div className="output">
            {filteredList.slice(0, 10).map((product) => { 
                return ( 
                    <a className="product" target="_blank"> 
                        <p>{product.ProductName}</p> 
                    </a> 
                ); 
            })}
        </div> 
    )}  */

    return ( 
        <div className="searchbar"> 
            <input type="text" placeholder={placeholder} onChange={Filter} /> 
        </div>
    )
} 

export default SearchBar
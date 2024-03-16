import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const Table = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const nameRef = useRef();
  const priceRef = useRef();
  const selectedPrice = useRef();

  // Fatch-api------------------------------------------------

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get("http://localhost:3001/product")
      .then((res) => {
        setData(res.data);
      });
  };

  // Submit-data-----------------------------------------------

  const submit = () => {
    const newName = nameRef.current.value.trim();
    const newPrice = parseInt(priceRef.current.value);

    if (!newName || !newPrice || isNaN(newPrice)) {
      alert("Please enter both product name and price.");
      return;
    }

    const newData = {
      name: newName,
      price: newPrice
    };

    axios.post("http://localhost:3001/product", newData)
      .then((res) => {
        setData([...data, res.data]);
        nameRef.current.value = '';
        priceRef.current.value = '';
        if (selectedPrice.current && newPrice <= selectedPrice.current) {
          setFilteredData([...filteredData, res.data]);
        }
      });
  };

  // Choose-Price----------------------------------------------

  const handleChoosePrice = (e) => {
    const chosenPrice = parseInt(e.target.value);
    selectedPrice.current = chosenPrice;

    if (!chosenPrice) {
      setFilteredData([]);
    } else {
      const filtered = data.filter(item => item.price <= chosenPrice);
      setFilteredData(filtered);
    }
  };

  // Delete-data-------------------------------------------------

  const deleteData = (id) => {
    axios.delete(`http://localhost:3001/product/${id}`)
      .then(() => {
        setData(data.filter((val) => val.id !== id));
      });
  };

  return (
    <div>

      {/* add & delete product------------------------------------------------------- */}

      <div style={{ marginBottom: '20px' }}>
        <label>Product name :-</label>
        <input type="text" ref={nameRef} placeholder='Product Name' style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
        <label>Price :-</label>
        <input type="number" ref={priceRef} placeholder='Price' style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
        <button className="btn btn-primary" onClick={submit} style={{ marginRight: '5px' }}>Add</button>
      </div>

      <table style={{ width: '50%', borderCollapse: 'collapse', border: '1px solid #ccc', textAlign: 'center' }}>
        <thead style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ccc' }}>
          <tr>
            <th style={{ padding: '10px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Product Name</th>
            <th style={{ padding: '10px', fontWeight: 'bold' }}>Price</th>
            <th style={{ padding: '10px', fontWeight: 'bold' }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {data.map((val, ind) => (
            <tr key={ind} style={{ borderBottom: '1px solid #ccc' }}>
              <td style={{ padding: '10px', fontSize: '16px', borderRight: '1px solid #ccc' }}>{val.name}</td>
              <td style={{ padding: '10px', fontSize: '16px', borderRight: '1px solid #ccc' }}>$ {val.price}</td>
              <td style={{ padding: '10px', fontSize: '16px' }}>
                <button onClick={() => deleteData(val.id)} className="btn btn-danger" style={{ marginRight: '5px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Choose price--------------------------------------------------------------- */}

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label>Choose your price :-</label>
        <input type="number" onChange={handleChoosePrice} placeholder='Choose Price' style={{ padding: '10px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px' }} />
      </div>

      <table style={{ width: '50%', borderCollapse: 'collapse', border: '1px solid #ccc', textAlign: 'center' }}>
        <thead style={{ backgroundColor: '#f2f2f2', borderBottom: '1px solid #ccc' }}>
          <tr>
            <th style={{ padding: '10px', fontWeight: 'bold', borderRight: '1px solid #ccc' }}>Product Name</th>
            <th style={{ padding: '10px', fontWeight: 'bold' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '10px' }}>No products match the chosen price.</td>
            </tr>
          ) : (
            filteredData.map((val, ind) => (
              <tr key={ind} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px', fontSize: '16px', borderRight: '1px solid #ccc' }}>{val.name}</td>
                <td style={{ padding: '10px', fontSize: '16px', borderRight: '1px solid #ccc' }}>$ {val.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
};

export default Table;

import { Table, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
const host = process.env.REACT_APP_HOST;

export default function Track() {
  const [loading, setloading] = useState(true);
  const [trackstate, settrackState] = useState([]);
  const getData = async() => {
      await fetch(host + "/api/osreq", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({statuscode: 1}),
    }).then(
      res => res.json()).then(data => {
        setloading(false);
        var modifieddata = JSON.parse(data);
        console.log(data);
        const modifiedaddress = [];
        for (var i in modifieddata)
          modifiedaddress.push(JSON.parse(modifieddata[i].address));
        settrackState(
          modifieddata.map((row,index) => ({
            key:index,
            uid: row.rowid,
            fname:row.fname,
            lname:row.lname,
            cemail:row.cemail,
            samples:row.samples,
            address:row.address,
            al1:modifiedaddress[index].line1,
            al2:modifiedaddress[index].line2,
            al3:modifiedaddress[index].line3,
            city:modifiedaddress[index].city,
            state:modifiedaddress[index].state,
            zip:modifiedaddress[index].zip,
            tnumber:row.tnumber,
          }))
        );
      }
    )
  }
  useEffect(() => {
    setloading(true);
    getData();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'uid',
      key:'uid',
    },
    {
      title: 'First Name',
      dataIndex:'fname',
      key: 'fname',
    },
    {
      title:'Last Name',
      dataIndex:'lname',
      key: 'lname',
    },
     {
      title:'Address Line 1',
      dataIndex: 'al1',
      key:'al1',
    },
    {
     title:'Address Line 2',
     dataIndex: 'al2',
     key:'al2',
    },
    {
      title:'Address Line 3',
      dataIndex: 'al3',
      key:'al3',
    },
    {
      title:'City',
      dataIndex: 'city',
      key:'city',
    },
    {
      title:'State',
      dataIndex: 'state',
      key:'state',
    },
    {
      title:'Zip Code',
      dataIndex: 'zip',
      key:'zip',
    },
    {
      title:'Customer Email',
      dataIndex:'cemail',
      key:'cemail',
    },
    {
      title:'Samples Requested',
      dataIndex:'samples',
      key:'samples',
    },
    {
    title: 'Tracking Number',
    key: 'tnumber',
    dataIndex:'tnumber',
    },
  ];
  return (
  <div className="container centered justify-content-center">
      <div className="col-xs-1 col-md-8">
        <div className="row text-center justify-content-center">
        <h1>Shipped Samples</h1>
            {loading ?
              (
                "Loading..."
              ) : (
                <Row>
                <Col span={24}>
        <Table columns={columns} dataSource={trackstate} />
        </Col>
        </Row>
      )
    }

    </div>
    </div>
    </div>
  )
}

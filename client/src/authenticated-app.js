import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {Switch, Route, Link} from 'react-router-dom';
import { Form, Input, DatePicker, SubmitButton } from 'formik-antd';
import { Divider, List, Table, Space, Modal, Button, Menu, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import Track from '../src/track.js';
import Purchase from '../src/purchase.js';
import {LogoutButton} from '../src/components/LogoutButton.js';
const { SubMenu } = Menu;
const host = process.env.REACT_APP_HOST;

export default function AuthenticatedApp() {
  return (
          <>
            <Menu mode="horizontal">
                <Menu.Item key="home">
                        <Link to="/">
                        Home</Link>
                  </Menu.Item>
                  <SubMenu key="samplesystem" title="Sample Requests">
                  <Menu.Item key="samplereq">
                       <Link to="/samplereq">
                        New Sample Request</Link>
                  </Menu.Item>
                  <Menu.Item key="ship">
                        <Link to="/ship">
                        Outstanding Requests</Link>
                  </Menu.Item>
                  <Menu.Item key="trackreq">
                        <Link to="/trackreq">
                        Shipped Requests</Link>
                  </Menu.Item>
                  <Menu.Item key="purchases">
                    <Link to="/containerpurchase">
                    Purchases</Link>
                  </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="logout">
                  <LogoutButton />
                  </Menu.Item>
              </Menu>
              <Switch>
                  <Route path="/ship">
                      <Ship />
                  </Route>
                 <Route path="/samplereq">
                      <SampleReq />
                  </Route>
                  <Route path="/trackreq">
                      <Track />
                  </Route>
                  <Route path="/containerpurchase">
                      <Purchase />
                  </Route>
                 <Route path="/">
                      <Home />
                  </Route>
              </Switch>
              </>
 );
}

const linklistdata = [
  {
    href:'https://www.quickbooks.com',
    title:'Quickbooks'
  },
  {
    href:'https://www.mycarriertms.com',
    title:'MyCarrier TMS'
  },
  {
    href:'https://www.expensify.com/authentication/saml/login',
    title:'Expensify'
  },
  {
    href:'https://fleetaccount.ford.com',
    title:'Ford Pro Vehicle Tracking'
  },
  {
    href:'https://www.hubspot.com',
    title:'Hubspot'
  },
  {
    href:'https://www.gusto.com',
    title:'Payroll'
  },
  {
    href:'https://inventory.dearsystems.com',
    title:'DEAR Inventory'
  },
  {
    href:'https://station.airlocklogistics.com',
    title:'Airlock Inventory System'
  }
];

function Home() {
  return (
  <div className="container centered justify-content-center">
      <div className="col-xs-1 col-md-8">
        <div className="row text-center justify-content-center">
            <h1> Vibe Cartons Internal Resources </h1>
        </div>
        <div className="row text-center justify-content-center">
            <div className="col-xs-2">
            <Divider orientation="left"> Quick Links </Divider>
            <List
            bordered
            dataSource= {linklistdata}
            renderItem={
              item => (
                <List.Item><a href={item.href}>{item.title}</a></List.Item>
              )
            }
            />
            </div>
        </div>
      </div>
  </div>
);
}
function Ship() {
  const [state, setState] = useState([]);
  const [loading, setloading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ratebutton, setRateButton] = useState(false);
  const [ratesloading, setRatesLoading] = useState(true);
  const [row, setRow] = useState();
  const [rates,setRates] = useState();
  const showModal = (rowuid) => {
    setIsModalVisible(true);
    setRatesLoading(true);
    console.log("ShowModal Visible" + rowuid)
    setRow(rowuid);
  };
  const handleOk = () => {
    console.log("HandleOK")
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    console.log("HandleCancel")
    setIsModalVisible(false);
  };
  const handlemanualchange = (checked) => {
    setRateButton(checked);
  }
  useEffect(() => {
    setloading(true);
    getData();
  }, []);

  const getshippingrates = async(submitvalues) => {
    await fetch(host + "/api/getrates", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    credentials:'include',
    body: JSON.stringify(submitvalues),
  }).then(res => res.json()).then(data => {
      console.log(data)
      const finalrates = [];
      for (let i=0;i<data.length;i++){
        var indrate = data[i];
        indrate.totalAmount = indrate.shippingAmount.amount + indrate.insuranceAmount.amount + indrate.confirmationAmount.amount + indrate.otherAmount.amount;
        finalrates.push(indrate);
      };
      setRates(finalrates);
      setRatesLoading(false);
  })};

  const getData = async() => {
      await fetch(host + "/api/osreq", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify({statuscode: 0}),
    }).then(
      res => res.json()).then(data => {
        setloading(false);
        var modifieddata = JSON.parse(data);
        const modifiedaddress = [];
        for (var i in modifieddata)
          modifiedaddress.push(JSON.parse(modifieddata[i].address));
        setState(
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
            zip:modifiedaddress[index].zip
          }))
        );
      }
    )
  }

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
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <Space size="middle">
        <button onClick = {showModal.bind(this, record.uid)}>Ship</button>
        <button onClick = {() => {intdel.bind(this, record.uid)}}>Mark as Delivered</button>
      </Space>
    ),
  },
  ];

  const ratecolumn = [
    {
      title:'RateID',
      dataIndex:'rateId',
      key:'rateId',
    },
    {
      title: 'Carrier',
      dataIndex: 'carrierCode',
      key:'carrierCode',
    },
    {
      title: 'Service',
      dataIndex:'serviceType',
      key: 'serviceType',
    },
    {
      title:'Rate',
      dataIndex:'totalAmount',
      key: 'totalAmount',
      sorter: (a,b) => a.totalAmount - b.totalAmount,
      defaultSortOrder:'ascend',
    },
    {
    title: 'Select',
    key: 'select',
    render: (text, record) => (
      <Space size="middle">
        <a href="javascript:" onClick = {getLabel.bind(this, record.rateId)}>Select</a>
      </Space>
    ),
  },
  ];
  const getLabel = (rid) => {
      setIsModalVisible(false);
      console.log(rid);
    fetch(host + "/api/labelreq", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify({rateId: rid})
      }).then(res => {
        if(res.status === 200) {
          res.json().then(body =>{
            console.log(body);
            const downloadlink = body.labelDownload.pdf;
            const eshipmentid = body.shipmentId; //Despite the name, this row uses Shipengine ShipmentID instead of externalOrderId, which is not provided in the response.
            fetch(host + "/api/statusupdate", {
              method:"POST",
              headers: {
                'Content-Type': 'application/json',
              },
              credentials:'include',
              body: JSON.stringify({esi: eshipmentid})
            }).then(res => {
              console.log(res.status);
            })
            Modal.success({
              content: <a href = {downloadlink}>{downloadlink}</a>,
              title: 'Download label using this link'
            })
          })
        } else throw new Error(res.status)
      })
  }
  console.log(state);
    return (
    <div className="container centered justify-content-center">
        <div className="col-xs-1 col-md-8">
          <div className="row text-center justify-content-center">
          <h1>Outstanding Requests</h1>
              {loading ?
                (
                  "Loading..."
                ) : (
        <Row>
          <Col span={24}>
          <Table columns={columns} dataSource={state} />
          </Col>
        </Row>
        )
      }
      <Modal title="Ship Samples" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
          Cancel
          </Button>,
        ]}
      >
      <p><b>Please provide package dimensions</b></p>
      <Formik
        onSubmit={async (values) => {
          const submitvalues = {row,...values};
          const rateloadfunc = await getshippingrates(submitvalues);
        }}
        initialValues={{
          manual: false
        }}
      >
      <Form>
      <p><Input name="length" addonBefore="Length" placeholder="inches" /> <Input name="width" addonBefore="Width" placeholder="inches" /> <Input name="height" addonBefore="Height" placeholder="inches" /> <Input name="weight" addonBefore="Weight" placeholder="lbs" /></p>
      <SubmitButton type="primary" disabled={false}>
      Get Rates
      </SubmitButton><br></br>
      {ratesloading ?
      (
        "Please Input Dimensions for Rates"
      ) : (
        <Table columns={ratecolumn} dataSource={rates} scroll = {{y:300}} />
      )
    }
      </Form>
      </Formik>
      </Modal>
          </div>
        </div>
    </div>
  );
}

function intdel(uid) {
  var patchbody = {
    uid: uid,
    statuscode: 1,
  };
  fetch(host + "/api/osreq", {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'include',
    body: JSON.stringify(patchbody),
  });
};

function shipstart(fname,lname,cemail,al1,al2,al3,city,state,zip) {
  var shipbody = {
    name: fname + lname,
    address_line1:al1,
    address_line2:al2,
    address_line3:al3,
    city_locality:city,
    state_province:state,
    postal_code:zip
  };
  fetch(host + "api/ship", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'include',
    body: JSON.stringify(shipbody),
  })
};

async function writetoDB(values) {
  await fetch(host + "/api/samplereqpost",{
    method:"POST",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials:'include',
    body: JSON.stringify(values)
  }).then(res => {
          if(res.status === 200) {
            return res.text();
          } else throw new Error(res.status)
    }).then(function(text) {
      alert(text);
/* Need to Clear Form here */
    }).catch((error) => {
      console.log(error);
    });
}



function SampleReq() {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const address = values.address;
    address.countryCode = 'US';
    await fetch(host + "/api/valaddress", {
      method:"POST",
      headers: {
        'Content-Type':'application/json',
      },
      credentials:'include',
      body:JSON.stringify(address)
    }).then(res => {
        console.log(res);
        res.json().then(result => {
        console.log(result);
        if (result[0].status === 'verified') {
          var validatedaddress = result[0].normalizedAddress;
          values.address.line1 = validatedaddress.addressLine1;
          values.address.line2 = validatedaddress.addressLine2;
          values.address.city = validatedaddress.cityLocality;
          values.address.state = validatedaddress.stateProvince;
          values.address.zip = validatedaddress.postalCode;
          console.log(values);
          writetoDB(values);
          resetForm();
        } else {
          alert("This address is not valid:", result);
        }
    })
    .catch((error) => {
      console.log(error);
    })
  })
    setTimeout(() => {
      setSubmitting(false);
    }, 400);
  }


  return (
   <div className="container centered justify-content-center">
    <div className="col-xs-1 col-md-8">
       <div className="row text-center justify-content-center">
        <h1> New Sample Request </h1>
        <Formik
          initialValues={{ fname: '', lname: '', cemail: '' , semail:''}}
          validationSchema={Yup.object({
            fname: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('Required'),
            lname: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
            cemail: Yup.string().email('Invalid email address'),
            semail: Yup.string().email('Invalid email address').required('Required'),
          })}
      onSubmit={handleSubmit}
    >
      <Form>
      <Form.Item name='fname'>
        <Input name="fname" type="text" placeholder="First Name"/>
      </Form.Item>
      <Form.Item name='lname'>
        <Input name="lname" type="text" placeholder="Last Name" />
      </Form.Item>
      <Form.Item name='cname'>
        <Input name="cname" type="text" placeholder="Company Name" />
      </Form.Item>
      <Form.Item name='cemail'>
        <Input name="cemail" type="email" placeholder="Customer Email"/>
      </Form.Item>
      <Form.Item name='semail'>
        <Input name="semail" type="email" placeholder="Sales Rep Email" />
      </Form.Item>
        <Input
          addonBefore="Address Line 1"
          name="address.line1"
        />
        <Input
          addonBefore="Address Line 2"
          name="address.line2"
        />
        <Input
          addonBefore="Address Line 3"
          name="address.line3"
        />
        <Input
          addonBefore="city"
          name="address.city"
        />
        <Input
          addonBefore="State"
          name="address.state"
        />
        <Input
          addonBefore="Zip Code"
          name="address.zip"
        />
        <Input.TextArea name="samples" placeholder="Requested Samples" />
        <DatePicker
        name="date"
        defaultPickerValue={moment()}
        placeholder="Required by Date"
        />
        <button type="submit">Submit</button>
      </Form>
    </Formik>
        </div>
        </div>
        </div>
    );
  }

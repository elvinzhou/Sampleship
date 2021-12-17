import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { Form, Input, InputNumber, Checkbox, DatePicker, SubmitButton, Switch as FormikSwitch } from 'formik-antd';
import { Table, Tag, Space, Modal, Button } from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';

export default function AuthenticatedApp() {
  return (
          <Router>
            <div>
                <nav className="navbar navbar-expand-lg">
                  <ul className="navbar-nav mr-auto">
                     <li className="nav-item">
                        <Link to="/">
                        Home</Link>
                      </li>
                     <li className="nav-item">
                       <Link to="/samplereq">
                        New Sample Request</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/ship">
                        Outstanding Requests</Link>
                      </li>
                  </ul>
                </nav>
                <Switch>
                  <Route path="/ship">
                      <Ship />
                  </Route>
                 <Route path="/samplereq">
                      <SampleReq />
                  </Route>
                 <Route path="/">
                      <Home />
                  </Route>
                </Switch>
            </div>
          </Router>
 );
}

function Home() {
  return (
  <div className="container centered justify-content-center">
      <div className="col-xs-1 col-md-8">
        <div className="row text-center justify-content-center">
            <h1> Internal Sample Request System </h1>
        </div>
      </div>
  </div>
);
}

async function getshippingrates(submitvalues) {
  await fetch("/api/getrates", {
  method: "POST",
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(submitvalues),
}).then(res => res.json()).then(data => {
    console.log(data);
    return data;
})}

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

  const getData = async() => {
      await fetch("/api/osreq", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
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
        <a href="javascript:" onClick = {showModal.bind(this, record.uid)}>Ship</a>
        <a href="javascript:" onClick = {() => {intdel.bind(this, record.uid)}}>Mark as Delivered</a>
      </Space>
    ),
  },
  ];

  const ratecolumn = [
    {
      title:'RateID',
      dataIndex:'rid',
      key:'rid',
    },
    {
      title: 'Carrier',
      dataIndex: 'carriercode',
      key:'ccode',
    },
    {
      title: 'Service',
      dataIndex:'service',
      key: 'service',
    },
    {
      title:'Rate',
      dataIndex:'rate',
      key: 'rate',
    },
    {
    title: 'Select',
    key: 'select',
    render: (text, record) => (
      <Space size="middle">
        <a href="javascript:" onClick = {getLabel.bind(this, record.rid)}>Select</a>
      </Space>
    ),
  },
  ];
  const getLabel = async (rid) => {
      setIsModalVisible(false);
      await fetch("/api/labelreq", {
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rid)
      }).then(res => {
        if(res.status === 200) {
          console.log(res.body)
        } else throw new Error(res.status)
      })
  }
  console.log(state);
    return (
    <div className="container centered justify-content-center">
        <div className="col-xs-1 col-md-8">
          <div className="row text-center justify-content-center">
              <h1> Internal Sample Request System </h1>
              {loading ?
                (
                  "Loading..."
                ) : (
          <Table columns={columns} dataSource={state} />
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
          const temprates = getshippingrates(submitvalues);
          console.log(temprates);
          setRates(temprates);
          setRatesLoading(false);
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
        <Table columns={ratecolumn} dataSource={rates} />
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
  fetch("/api/osreq", {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
    },
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
  fetch("api/ship", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(shipbody),
  })
};

async function writetoDB(values) {
  await fetch("/api/samplereqpost",{
    method:"POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values)
  }).then(res => {
          if(res.status === 200) {
            return res.text();
          } else throw new Error(res.status)
    }).then(function(text) {
      alert(text);
    }).catch((error) => {
      console.log(error);
    });
}



function SampleReq() {
  const handleSubmit = async (values, { setSubmitting }) => {
    await fetch("/api/valaddress", {
      method:"POST",
      headers: {
        'Content-Type':'application/json',
      },
      body:JSON.stringify(values.address)
    }).then(res => {
      if(res.status === 200) {
        var result = res.body;
        if (result[0].status === 'verified') {
          var validatedaddress = result[0].normalizedAddress;
          values.address.line1 = validatedaddress.addressLine1;
          values.address.line2 = validatedaddress.addressLine2;
          values.address.city = validatedaddress.cityLocality;
          values.address.state = validatedaddress.stateProvince;
          values.address.zip = validatedaddress.postalCode;
          writetoDB(values);
        } else {
          alert("This address is not valid:", result);
        }
      } else throw new Error(res.status)
    });
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
            cemail: Yup.string().email('Invalid email address').required('Required'),
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

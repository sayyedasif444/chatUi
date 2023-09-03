import React from 'react';
import { Input, Layout, Popover } from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import moment from 'moment/moment';
const data = require('../data.json');

const { Content, Sider } = Layout;

const ConversationList = () => {
  const [conversation, setconversation] = useState([]);
  const [searchConvo, setsearchConvo] = useState('');
  const [selectedConvo, setselectedConvo] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('conversation') !== null) {
      setconversation(JSON.parse(localStorage.getItem('conversation')));
    } else {
      var newSet = JSON.parse(JSON.stringify(data.conversation));
      setconversation(newSet);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversation', JSON.stringify(conversation));
    setselectedConvo(
      conversation.filter((ele) => ele.isActive).length > 0
        ? conversation.filter((ele) => ele.isActive)[0]
        : null
    );
  }, [conversation]);

  const conversationChange = (id) => {
    var newSet = conversation.map((ele) => {
      return { ...ele, isActive: false };
    });
    newSet[conversation.map((ele) => ele.id).indexOf(id)].isActive = true;
    setconversation(newSet);
  };

  // popover code
  const [searchContact, setsearchContact] = useState('');
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  //add message
  const [messageInput, setmessageInput] = useState('');
  const sendMessage = (msg, id) => {
    var newSet = [...conversation];
    var index = newSet.map((ele) => ele.id).indexOf(id);
    if (index > -1) {
      newSet[index].history.push({
        incoming: false,
        message: msg,
        date: moment(new Date()).format('DD-MM-YYYY hh:mm A'),
      });
    }
    console.log(newSet);
    setconversation(newSet);
    setselectedConvo(newSet[index]);
    setmessageInput('')
  };

  return (
    <Layout>
      <Layout>
        <Sider
          width={300}
          style={{
            background: '#fff',
            height: '100vh',
          }}
        >
          <div className='p-3'>
            <Input
              placeholder='Search for conversation'
              style={{ borderRadius: '0px' }}
              value={searchConvo}
              onChange={(e) => setsearchConvo(e.target.value)}
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,0.4)' }} />}
            />
          </div>
          <p
            className='p-3 mb-1 border-bottom'
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '5px',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
            }}
          >
            Converstation
            <Popover
              content={
                <div className='popoverDiv'>
                  <Input
                    placeholder='Search for conversation'
                    style={{ borderRadius: '0px' }}
                    value={searchContact}
                    onChange={(e) => setsearchContact(e.target.value)}
                    prefix={
                      <SearchOutlined style={{ color: 'rgba(0,0,0,0.4)' }} />
                    }
                  />
                  <div className='searchResult'>
                    {conversation
                      .filter((ele) =>
                        ele.contact
                          .toLowerCase()
                          .includes(searchContact.toLowerCase())
                      )
                      .map((ele, index) => (
                        <Link
                          to='#!'
                          key={index}
                          className='w-100'
                          onClick={(e) => {
                            conversationChange(ele.id);
                            setOpen(false);
                            setsearchContact('');
                          }}
                        >
                          <div className='p-2 border-bottom'>{ele.contact}</div>
                        </Link>
                      ))}
                  </div>
                </div>
              }
              trigger='click'
              open={open}
              placement='rightTop'
              onOpenChange={handleOpenChange}
            >
              <Link
                to='#!'
                onClick={(e) => e.preventDefault()}
                style={{ fontSize: '22px', float: 'right', marginTop: '-10px' }}
              >
                <PlusCircleOutlined />
              </Link>
            </Popover>
          </p>
          <div style={{ height: '80vh', overflow: 'auto' }}>
            {conversation
              .filter(
                (ele) =>
                  (ele.isActive || ele.history.length > 0) &&
                  ele.contact.toLowerCase().includes(searchConvo.toLowerCase())
              )
              .map((ele, index) => (
                <div
                  className={
                    'border-bottom  p-2 onHover ' + (ele.isActive && 'active')
                  }
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => conversationChange(ele.id)}
                  key={index}
                >
                  <div
                    style={{
                      width: '40px',
                      overflow: 'hidden',
                      borderRadius: '20px',
                      background: '#fff',
                    }}
                    className='border p-1'
                  >
                    <img src={'./user.jpg'} alt='' style={{ width: '100%' }} />
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <h6 className='mb-0 pb-0 '>{ele.contact}</h6>
                    <p
                      className={
                        'mb-0 pb-0 ' +
                        (ele.isActive ? 'text-white' : 'text-black-50')
                      }
                    >
                      {ele.history.length > 0
                        ? ele.history[ele.history.length - 1].message.substr(
                            0,
                            28
                          )
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </Sider>
        {selectedConvo !== null && (
          <Layout
            style={{
              padding: '0 0px 0px',
            }}
            className='border'
          >
            <div className='headerNav border'>
              <div
                style={{
                  width: '40px',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  background: '#fff',
                }}
                className='border p-1'
              >
                <img src={'./user.jpg'} alt='' style={{ width: '100%' }} />
              </div>
              <h6 className='pl-4'>{selectedConvo.contact}</h6>
            </div>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: 'rgba(0,0,0,0.0001)',
              }}
            >
              {selectedConvo !== null &&
                selectedConvo.history.map((ele, ind) =>
                  ele.incoming ? (
                    <div className='incoming' key={ind}>
                      <div className='message'>{ele.message}</div>
                      <small>{ele.date}</small>
                    </div>
                  ) : (
                    <div className='outgoing' key={ind}>
                      <div className='message'>{ele.message}</div>
                      <small>{ele.date}</small>
                    </div>
                  )
                )}
            </Content>
            <div className='chatInput'>
              <Input
                placeholder='Enter your message'
                size='large'
                value={messageInput}
                onKeyPress={(e) => {
                  if (e.key === 'Enter')
                    sendMessage(messageInput, selectedConvo.id);
                }}
                onChange={(e) => setmessageInput(e.target.value)}
                suffix={
                  <SendOutlined
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.preventDefault();
                      sendMessage(messageInput, selectedConvo.id);
                    }}
                  />
                }
                style={{ borderRadius: '0px' }}
              />
            </div>
          </Layout>
        )}
      </Layout>
    </Layout>
  );
};

export default ConversationList;

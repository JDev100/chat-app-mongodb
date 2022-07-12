import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput'
import Logout from './Logout'
import Messages from './Messages'
import axios from 'axios'
import { getAllMsgRoute, sendMsgRoute } from '../utils/APIRoutes'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css';
import { v4 as uuidv4 } from 'uuid'

const ChatContainer = ({ currentChat, currentUser, socket }) => {
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const scrollRef = useRef()
    useEffect(() => {

        async function action() {
            if (currentChat) {

                const response = await axios.post(getAllMsgRoute, {
                    from: currentUser._id,
                    to: currentChat._id
                })
                setMessages(response.data)
            }

        }
        action()
    }, [currentChat])

    const handleSendMsg = async (msg) => {
        await axios.post(sendMsgRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })
        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg
        })

        const msgs = [...messages]
        msgs.push({ fromSelf: true, message: msg })
        setMessages(msgs)
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-receive', (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg })
            })
        }
    }, [])

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (

        <Container>
            <div className='chat-header'>
                <div className="user-details">
                    <div className="avatar">
                        <img src={currentChat.avatarImage} alt="avatar" />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>

            {/* <Messages/> */}
            {/* <SimpleBar className='chat-messages-bar' style={{ maxHeight: 300 }}> */}
                <div className="chat-messages">
                    {
                        messages.map((message, i) => {
                            return (
                                <div ref={scrollRef} key={uuidv4()}>
                                    <div className={`message ${message.fromSelf ? 'sent' : 'recieved'}`}>
                                        <div className="content">
                                            <p>
                                                {message.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            {/* </SimpleBar> */}

            <ChatInput handleSendMsg={handleSendMsg} />

        </Container>

    )
}

const Container = styled.div`
 display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
    /* padding-top: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%; */
    gap:0.1rem;
    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;
            .avatar {
                
                img {
                    height: 3rem;
                }
            }
            .username {
                h3 {
                    color: white
                }
            }
        }
    }
    .chat-messages-bar {
        height: 100%;
    }
    .chat-messages {
        /* max-height: 80vh; */
        flex: 1;
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        overflow: auto;
        /* &::-webkit-scrollbar {
            width: .2rem;
            background-color: #ffffff39;
        }
        &::-webkit-scrollbar-thumb {
            width: 0.1rem;
            border-radius: 1rem;
        } */
        .message {
            margin: .25rem 0;
            display: flex;
            align-items: center;
            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color:#d1d1d1;
            }
        }
        .sent {
            justify-content: flex-end;
            .content {
                background-color: #4f04ff21;
            }
        }
        .recieved {
            justify-content: flex-start;
            .content {
                background-color: #9900ff20 ;
            }
        }
    }
`

export default ChatContainer
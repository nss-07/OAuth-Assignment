import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import Styled from "styled-components";
import { AuthContext } from "../App";
import InfiniteScroll from 'react-infinite-scroller';
import fetch from "node-fetch";


export default function Home() {
    const { state, dispatch } = useContext(AuthContext);

    if (!state.isLoggedIn) {
        return <Redirect to="/login" />;
    }

    const { avatar_url, name, total_private_repos, followers, following } = state.user.res
    const events = state.user.ev

    const handleLogout = () => {
        dispatch({
            type: "LOGOUT"
        });
    }

    return (
        <Wrapper>
            <div className="container">
                <button onClick={() => handleLogout()}>Logout</button>
                <div>
                    <div className="content">
                        <img src={avatar_url} alt="Avatar" />
                        <span>{name}</span>
                        <span>{total_private_repos} Repos</span>
                        <span>{followers} Followers</span>
                        <span>{following} Following</span>
                    </div>
                </div>
            </div>
            <InfiniteScroll
                pageStart={0}
                loadMore={() => {}}
                hasMore={true || false}
                loader={<div className="loader" key={0}>Loading ...</div>}>
                {events.map((event, index) => (
                    <div key={index}>
                        {JSON.stringify(event)} - #{index}
                    </div>
                ))}
            </InfiniteScroll>
        </Wrapper>
    );
}

const Wrapper = Styled.section`
.container{
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: Arial;
  button{
    all: unset;
    width: 100px;
    height: 35px;
    margin: 10px 10px 0 0;
    align-self: flex-end;
    background-color: #0041C2;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #0041C2;
    &:hover{
      background-color: #fff;
      color: #0041C2;
    }
  }
  .content{
  -webkit-box-shadow: 5px 5px 15px rgba(0,0,0,0.2);
  box-shadow: 5px 5px 15px rgba(0,0,0,0.2);
  }
  >div{
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 18px;
    justify-content: center;
    align-items: center;
    .content{
      display: flex;
      flex-direction: column;
      padding: 20px 100px;    
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      width: auto;
  
      img{
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
  
      >span:nth-child(2){
        margin-top: 20px;
        font-weight: bold;
      }
  
      >span:not(:nth-child(2)){
        margin-top: 8px;
        font-size: 14px;
      }
  
    }
  }
}
`;
import React, { useState, useEffect } from "react";
import { Box, Fab, Paper, Typography } from "@mui/material";
import ChatHeader from "./components/ChatHeader";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import chatBot from "./components/img/chatBot.gif";
import { useSelector, useDispatch } from "react-redux";
import { setParam, resetParam } from "../../Redux/Actions/paramSlice";
import { Alarm, AutoAwesomeOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";
import { getAuthorizedAxiosIntance } from "../../utils/axiosConfig";

const axiosInstance = await getAuthorizedAxiosIntance();

// http://localhost:5000
const API_BASE_URL = "http://localhost:3030";

const ChatBot = ({ isOpen, isPin, onStateChange, onFileChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ bottom: 25, right: 35 });
  const user = useSelector((state) => state.auth.login.currentUser);

  const paramState = useSelector((state) => state.param);
  const paramLang = useSelector((state) => state.language);

  const [dataQuestionAPI, setDataQuestionAPI] = useState([]);

  const fetchQuestion = async (model) => {
    try {
      const response = await axiosInstance.post(
        "api/v1/user/QuestionAPI",
        model
      );
      setDataQuestionAPI(response.data || []); // Cập nhật state với danh sách file
      console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [messages, setMessages] = useState([
    {
      sender: "Bot",
      text: "Hello! How can I help you today ?",
      time: new Date().toLocaleString(),
      pageName: "",
      pageNumber: "",
    },
  ]);

  const dispatch = useDispatch();

  const fetchAIChatbot = async (model) => {
    try {
      const response = await axiosInstance.post("api/v1/chatbot", model);
      // const response = await fetch(`${API_BASE_URL}/api/v1/chatbot`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(model)
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data1 = await response.json();
      const data1 = response.data || [];

      const data = data1[0].custom;

      // 👉 Khi server trả lời xong, xoá "Đang suy nghĩ...", thay bằng câu trả lời thật
      setMessages((prev) => {
        const newMessages = [...prev];
        // Xóa message Loading cuối cùng
        if (
          newMessages.length > 0 &&
          newMessages[newMessages.length - 1].isLoading
        ) {
          newMessages.pop();
        }
        return [
          ...newMessages,
          {
            sender: "Bot",
            text: data.answer,
            time: new Date().toLocaleString(),
            pageName: data.file_name,
            pageNumber: data.PageNumber,
          },
        ];
      });

      setIsLoading(false); // Kết thúc loading

      // ... dispatch Redux các thứ như cũ
      dispatch(
        setParam({
          answer: data.answer,
          PageNumber: data.PageNumber,
          data: data.data,
          do_query: data.do_query,
          file_name: data.file_name,
          msg: data.msg,
          page: data.page,
          questions: data.questions,
          showpage: data.showpage,
          status_code: data.status_code,
          params: {
            Building: data.params.Building,
            Factory: data.params.Factory,
            Linename: data.params.Linename,
            Machine: data.params.Machine,
            Project: data.params.Project,
            Section: data.params.Section,

            starttime: data.params.starttime
              ? data.params.starttime === data.params.endtime
                ? dayjs(data.params.starttime).format("YYYY-MM-DD") +
                  " 00:00:00"
                : dayjs(data.params.starttime).format("YYYY-MM-DD HH:mm:ss")
              : null,
            endtime: data.params.starttime
              ? data.params.starttime === data.params.endtime
                ? dayjs(data.params.endtime).format("YYYY-MM-DD") + " 23:59:59"
                : data.params.endtime
                ? dayjs(data.params.endtime).format("YYYY-MM-DD HH:mm:ss")
                : dayjs(data.params.starttime).format("YYYY-MM-DD") + " 23:59:59"
              : null,
          },
          topic: {
            count: data.topic.count,
            object: data.topic.object,
            order: data.topic.order,
            property: data.topic.property,
            type: data.topic.type,
            type_q: null,
            type_topic: data.topic.type_topic,
          },
        })
      );
    } catch (error) {
      console.error("Error fetching chatbot:", error);

      setMessages((prev) => {
        const newMessages = [...prev];
        if (
          newMessages.length > 0 &&
          newMessages[newMessages.length - 1].isLoading
        ) {
          newMessages.pop();
        }
        return [
          ...newMessages,
          {
            sender: "Bot",
            text: "Xin lỗi, hệ thống gặp lỗi. Vui lòng thử lại sau.",
            time: new Date().toLocaleString(),
          },
        ];
      });

      setIsLoading(false);
    }
  };

  const handleSendMessage = (message) => {
    const modal = {
      id_page: `/${paramState.page.dep}/${paramState.page.page_name}`,
      id_user: `${user.username}`,
      msg: message,
    };
    setMessages((prev) => [
      ...prev,
      { sender: "User", text: message, time: new Date().toLocaleString() },
    ]);

    setMessages((prev) => [
      ...prev,
      {
        sender: "Bot",
        text: "Loading",
        time: new Date().toLocaleString(),
        isLoading: true,
      },
    ]);

    setIsLoading(true);

    fetchAIChatbot(modal);
  };

  const handleChangeQuestion = (imodel) => {
    const newModel = {
      department: paramState.page.dep,
      page: paramState.page.page_name,
      lang: paramLang.lang || "en",
    };
    fetchQuestion(newModel);
  };

  // const handleUpdateParam = ({data1}) =>{
  //   dispatch(setParam({
  //     answer: data1.answer,
  //     data:data1.data,
  //     file_name: data1.file_name,
  //     // params:{
  //     //   starttime: data.params.starttime ,
  //     //   endtime: data.params.endtime,
  //     // }
  //   }))
  // }

  const toggleChat = () => {
    onStateChange({ isPin: !isPin });
  };

  const handleOpenChat = () => {
    onStateChange({ isOpen: !isOpen });
  };
  const handleSetFile = (model) => {
    onFileChange(model);
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", "dragging");
  };
  const handleDragEnd = (e) => {
    const newBottom = window.innerHeight - e.clientY;
    const newRight = window.innerWidth - e.clientX;
    setPosition({
      bottom: Math.max(0, newBottom),
      right: Math.max(0, newRight),
    });
  };

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <Box>
      {isVisible && (
        <Fab
          color="#ff0909"
          size="small"
          sx={{
            position: "fixed",
            // backgroundColor: theme.palette.background.conponent2,
            background:
              "linear-gradient(to left, rgba(120, 123, 255, 0.9), rgba(120, 123, 255, 0.5))",
            bottom: position.bottom,
            right: 0,
            color: theme.palette.primary.conponent,
            transition: "transform 0.25s ease-out",
            transform: !isOpen ? "scale(1) translateX(45%)" : "scale(0)",
            transformOrigin: "right bottom",
            zIndex: 9999,
            opacity: 1,
            borderTopRightRadius: "unset",
            borderBottomRightRadius: "unset",
            borderTopLeftRadius: "30px",
            borderBottomLeftRadius: "30px",
            width: "90px",
            paddingRight: "10px",
            "&:hover": {
              backgroundColor: theme.palette.background.conponent2,
              transform: !isOpen ? "translateX(0%)" : "",
              color: theme.palette.primary.conponent2,
            },
          }}
          draggable={true}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleOpenChat}
        >
          <AutoAwesomeOutlined sx={{ fontSize: 30, float: "left" }} />
          <Typography sx={{ fontSize: 20, float: "right", marginLeft: "15px" }}>
            AI
          </Typography>
        </Fab>

        // <Fab
        //   color='#999'
        //   sx={{
        //     position: "fixed",
        //     bottom: position.bottom,
        //     right: position.right,
        //     transition: 'transform 0.25s ease-out',
        //     transform: !isOpen ? 'scale(1)' : 'scale(0)',
        //     transformOrigin: 'right bottom',
        //     zIndex:9999,
        //     opacity: 0.8,
        //     '&:hover': { opacity: 1},
        //   }}
        //   draggable={true}
        //   onDragStart={handleDragStart}
        //   onDragEnd={handleDragEnd}
        //   onClick={handleOpenChat}
        // >
        //   <img src={chatBot} style={{width:180, height: 180}}></img>
        // </Fab>
      )}

      {/* giao dien chatBot */}

      <Paper
        elevation={5}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          width: 340,
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          zIndex: 999,
          height: "90vh", // Full height minus padding
          transition: "transform 0.25s ease-out",
          transform: isOpen ? "scale(1)" : "scale(0)",
          transformOrigin: "right bottom",
        }}
      >
        <ChatHeader
          onClose={handleOpenChat}
          toggleChat={toggleChat}
          isPin={isPin}
        ></ChatHeader>
        <ChatWindow setFile={handleSetFile} messages={messages}></ChatWindow>
        <ChatInput
          onSend={handleSendMessage}
          onChangeQuestion={handleChangeQuestion}
          idata={dataQuestionAPI}
        ></ChatInput>
      </Paper>
    </Box>
  );
};

export default ChatBot;

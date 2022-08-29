# Simple HTTP SERVER in C
In this project I dealt with network protocols, especially HTTP and TCP. I wrote a simple HTTP server in c, which does nothing else than handle Get and Post requests.
## Motivation
For my Google Home project I needed a server that can handle Get and Post requests. I always knew HTTP server as simple nodejs express libarys or one line commands in python. But that did not satisfy me anymore. I wanted to know what the HTTP protocol looks like and how it works. During my research I came across with TCP (Maybe in the future i will make a projekt only for TCP) which is responsible for transferring requests. And what is better and possible to code programs from stratch, exactly the C language. 
## How HTTP Works
HTTP (Hypertxext Transfer Potrocol), like SMTP or IMAP, is a network protocol mainly used for data exchange on a website. HTTP is the main element for loading web pages. The HTML and JS data is requested via a Get Request and sent by the server via a body to the client, i.e. the web browser, which then displays this data.  <br/><br/> 
The HTTP protocol can be divided into three parts. The Request, Transfer and Response
### Request
To begin, we need to briefly understand how a web server is built. Basically a web server does nothing but wait for a request, you can think of it as an infinite loop or idle. The web server is in idle state until a client connects. HTTP server URL look like this `http:example.com:80` `:80` stands for the port the webserver is listing, normally a HTTP web server always runs on port 80. But keep in mine a domain can have many webserver on differnt ports. B assicly the HTTP Request is nothing than plain Text trnsfert over TCP to the Webserver.   <br/><br/> 
Ab Basic HTTP Request can look like this: 
```
GET /example HTTP/1.1
Host: example.com:80
User-Agent: Manual-Http-Request
```

A request consists of headers that carry useful information to the web server via the client usual. Like the request type, the host, what kind of data the client can process and much more [Link To all HTTP Headers](https://developer.mozilla.org/de/docs/Web/HTTP/Headers). 

### Transfer
I don't want to talk about the transfer in detail because that is a different topic. Only briefly said one uses mostly for HTTP the TCP protocol which communicates with the user over Handshake package.

### Response
Responses usually consist of a status code and a body. The status code is a good and quick indication for the client whether the request was successful or an error occurred. For example, the status code 200 is sent back to the user for an error-free request, but 404 indicates that the request has an error.
[Link To all HTTP Statuscodes](https://developer.mozilla.org/de/docs/Web/HTTP/Status). 

```
HTTP/1.1 400 Bad Request
```
This is a Sample HTTP Fail Response usally the Response has a body, where for example the error is explained in more detail

## How to Use
The program works with a callback function, which is always executed when a request is passed 
```c
void CALLBACK(char response[MAXLINE+1], int type, char* Path, int connection, u_int8_t buff[MAXLINE+1]){}
```
1. The response parameter passes the HTTP response with the header and with further data, for Debug Print you can use ``DebugRequest(request)``
2. The Type parmert ist to identify the Type of the HTTP request.

```c
      if(strstr(curLine, "GET") != NULL) return 0;

      if(strstr(curLine, "POST") != NULL) return 1;

      if(strstr(curLine, "HEAD") != NULL) return 2;

      if(strstr(curLine, "PUT") != NULL) return 3;

      if(strstr(curLine, "DELETE") != NULL) return 4;

      if(strstr(curLine, "CONNECT") != NULL) return 5;

      if(strstr(curLine, "TRACE") != NULL) return 6;
     
      if(strstr(curLine, "PATCH") != NULL) return 7;
```
3. The Path Paramter passes the rout of the HTTP Request
4. Connection and Buff are only to Send Response

### Send Response 
```c
void SendResponse(u_int8_t buff[MAXLINE+1], char* Response, int connectionNumber){}
```
Example: 
```c
SendResponse(buff, "HTTP/1.1 200 OK\n\r\n\r\nPATH NOT USED", connection);
```



#include "HTTP.h"



void SendResponse(u_int8_t buff[MAXLINE+1], char* Response, int connectionNumber){
     snprintf((char*)buff, MAXLINE+1, "HTTP/1.1 200 OK\n\r\n\r\nHELLO");

     //"HTTP/1.1 200 OK\n\r\n\r\nHELLO"

   write(connectionNumber, (char*) buff, strlen((char*)buff));

   return;
}


char* GetPath(char request[MAXLINE + 1]){
 char *path  = NULL;

   if(strtok(request, " "))
      {
      path = strtok(NULL, " ");
      if(path)
         path=strdup(path);
      }

   return(path);
};


int GetRequestType(char request[MAXLINE +1]){
     char * curLine = request;
   while(curLine)
   {
      char * nextLine = strchr(curLine, '\n');
      if (nextLine) *nextLine = '\0';  // temporarily terminate the current line
    
      if(strstr(curLine, "GET") != NULL) return 0;

      //printf("%s\n",curLine);
      //printf("GET / HTTP/1.1\n");
      //printf("%d\n\n", strcmp(curLine, "GET / HTTP/1.1\0"));

      if(strstr(curLine, "POST") != NULL) return 1;

      if (nextLine) *nextLine = '\n';  // then restore newline-char, just to be tidy    
      curLine = nextLine ? (nextLine+1) : NULL;
   }
   return -1;
};


struct sockaddr_in InitServer(int PORT){
     struct sockaddr_in serveraddr;
     bzero(&serveraddr, sizeof(serveraddr));
     serveraddr.sin_family = AF_INET;
     serveraddr.sin_addr.s_addr = htonl(INADDR_ANY);
     serveraddr.sin_port = htons(PORT);
     return serveraddr;
};

void StartServer(struct sockaddr_in server, int PORT, void (*GET_CALLBACK)(char response[MAXLINE -1], char* Path, int connection, u_int8_t buff[MAXLINE+1]),void (*POST_CALLBACK)(char response[MAXLINE -1], char* Path, int connection, u_int8_t buff[MAXLINE+1])){
      int listenfd, connfd, n;
    u_int8_t buff[MAXLINE +1];
    char revline[MAXLINE +1];

     if((listenfd = socket(AF_INET,SOCK_STREAM, 0)) < 0){
      printf("Could not init a socket");
      exit(1);   
    }

    if(bind(listenfd, (struct sockaddr *)&server , sizeof(server)) < 0){
         printf("Could not bind server");
         exit(1);
    }

    if((listen(listenfd,10)) < 0){
         printf("Could not start server");
         exit(1);
    }

   while(1){
      struct sockaddr_in addr;
      socklen_t addr_len;
      printf("Waiting for connection");

      fflush(stdout);

      connfd = accept(listenfd,NULL, NULL);

      memset(revline, 0, MAXLINE);

      while ((n = read(connfd, revline, MAXLINE - 1)) > 0 ){
       //fprintf(stdout, "%s", revline);

       if(strcmp(&revline[n-1], "\n") == 0){
        break;
       }

       if(n < 0){
        printf("read error");
        exit(1);
       }

      }

    int type = GetRequestType(revline);
    char* Line = GetPath(revline);

     if(type == 0){
          printf("GET");
       GET_CALLBACK(revline, Line, connfd, buff);
    }

     if(type == 1){
     POST_CALLBACK(revline, Line, connfd, buff);
    }

       memset(revline, 0, MAXLINE);


       close(connfd);
      
    }
    return;
}



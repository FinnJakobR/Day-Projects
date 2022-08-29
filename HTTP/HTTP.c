#include "HTTP.h"



//TODO: Change to one Callback with type parameter
void SendResponse(u_int8_t buff[MAXLINE+1], char* Response, int connectionNumber){
     
     snprintf((char*)buff, MAXLINE+1, "%s",Response);

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

void DebugRequest(char request[MAXLINE +1]){
        char * curLine = request;
   while(curLine)
   {
      char * nextLine = strchr(curLine, '\n');
      if (nextLine) *nextLine = '\0';  // temporarily terminate the current line
       printf("%s\n", curLine);

      if (nextLine) *nextLine = '\n';  // then restore newline-char, just to be tidy    
      curLine = nextLine ? (nextLine+1) : NULL;
   }
}


int GetRequestType(char request[MAXLINE +1]){
     char * curLine = request;
   while(curLine)
   {
      char * nextLine = strchr(curLine, '\n');
      if (nextLine) *nextLine = '\0';  // temporarily terminate the current line
    
      if(strstr(curLine, "GET") != NULL) return 0;

      if(strstr(curLine, "POST") != NULL) return 1;

      if(strstr(curLine, "HEAD") != NULL) return 2;

      if(strstr(curLine, "PUT") != NULL) return 3;

      if(strstr(curLine, "DELETE") != NULL) return 4;

      if(strstr(curLine, "CONNECT") != NULL) return 5;

      if(strstr(curLine, "TRACE") != NULL) return 6;
     
      if(strstr(curLine, "PATCH") != NULL) return 7;

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

void StartServer(struct sockaddr_in server, int PORT, void (*CALLBACK)(char response[MAXLINE+1], int type, char* Path, int connection, u_int8_t buff[MAXLINE+1])){
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
      printf("Waiting for connection\n");

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

       char ResponseCopy[MAXLINE+1];

        strcpy(ResponseCopy, revline);

    int type = GetRequestType(revline);
    char* Line = GetPath(revline);

    strcpy(revline,ResponseCopy);


     if(type != -1){

       CALLBACK(revline, type, Line, connfd, buff); //TODO: char[] -> char* 
    }

    if(type == -1){
     SendResponse(buff, "HTTP/1.1 405 Method Not Allowed\n\r\n\r\nTHIS TYPE IS NOT ALLOWED", connfd);;
    }

       memset(revline, 0, MAXLINE);


       close(connfd);
      
    }
    return;
}



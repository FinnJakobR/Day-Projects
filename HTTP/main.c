#include "HTTP.h"


int i = 0;

void GET_CALLBACK(char response[MAXLINE -1], char* Path, int connection, u_int8_t buff[MAXLINE+1]){
   
   SendResponse(buff, "HTTP/1.1 200 OK\n\r\n\r\nHELLO", connection);

   return;
}

void POST_CALLBACK(char response[MAXLINE -1], char* Path, int connection, u_int8_t buff[MAXLINE+1]){


 return;
}

int main (){
  
    struct sockaddr_in server = InitServer(18000);

    StartServer(server, 18000, GET_CALLBACK, POST_CALLBACK);
   
   return 0;
}
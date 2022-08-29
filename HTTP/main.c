#include "HTTP.h"




void CALLBACK(char response[MAXLINE+1], int type, char* Path, int connection, u_int8_t buff[MAXLINE+1]){
   SendResponse(buff, "HTTP/1.1 200 OK\n\r\n\r\nHELLO", connection);

   return;
}

int main (){
  
    struct sockaddr_in server = InitServer(18000);

    StartServer(server, 18000, CALLBACK);
   
   return 0;
}
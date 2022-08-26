#include <sys/socket.h>
#include <stdlib.h>
#include <sys/types.h>
#include <signal.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <stdarg.h>
#include <errno.h>
#include <fcntl.h>
#include <sys/time.h>
#include <sys/ioctl.h>
#include <netdb.h>
#include <stdbool.h>


// 0 = GET / 1 = POST

int MAXLINE = 4600;


int RequestType(char request[MAXLINE +1]){
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
}


char GetPath(char* line){
    char* Path[MAXLINE-1];
    char* substring;
    int index;

    return &Path;
}
 

struct sockaddr_in InitServer(int PORT){
struct sockaddr_in serveraddr;

bzero(&serveraddr, sizeof(serveraddr));

serveraddr.sin_family = AF_INET;
serveraddr.sin_addr.s_addr = htonl(INADDR_ANY);
serveraddr.sin_port = htons(PORT);

return serveraddr;
}

void StartServer(struct sockaddr_in server, int PORT){
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
       fprintf(stdout, "%s", revline);

       if(strcmp(&revline[n-1], "\n") == 0){
        break;
       }

       if(n < 0){
        printf("read error");
        exit(1);
       }

      }

    int type = RequestType(revline);

    printf("%d\n", type);

      memset(revline, 0, MAXLINE);

      printf("ANFRAGE ist vorbei\n");

       snprintf((char*)buff, sizeof(buff), "HTTP/1.1 200 OK\n\r\n\r\nHELLO");

       write(connfd, (char*) buff, strlen((char*)buff));

       close(connfd);
      
    }
    return;
}






int main(){

    struct sockaddr_in server = InitServer(18000);

    StartServer(server, 18000);

    return 0;
}
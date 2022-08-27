#ifndef HTTP   /* Include guard */
#define HTTP
#include <sys/socket.h>
#include <stdint.h>
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

#define MAXLINE 4600

struct sockaddr_in InitServer(int PORT);
void StartServer(struct sockaddr_in server, int PORT, void (*GET_CALLBACK)(char response[MAXLINE -1], char* Path, int connfd, u_int8_t buff[MAXLINE+1]), void (*POST_CALLBACK)(char response[MAXLINE -1], char* Path, int connfd, u_int8_t buffbuff[MAXLINE+1]));
int GetRequestType(char request[MAXLINE + 1]);
char* GetPath(char request[MAXLINE + 1]);
void SendResponse(u_int8_t buff[MAXLINE+1], char* Response, int connectionNumber);

#endif // FOO_H_
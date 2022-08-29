#include "HTTP.h"
#include <stdbool.h>
#define _GNU_SOURCE
#include <math.h>



void ReadFile(char* FilePath, char* PORTARR){
 FILE* file = fopen(FilePath, "r");
 char * line = NULL;
size_t len = 0;
ssize_t read;
  if (file == NULL) 
            {   
              printf("Error! Could not open file\n"); 
              exit(-1); // must include stdlib.h 
            } 
while ((read = getline(&line, &len, file)) != -1) {
        strcat(PORTARR, line);
    }

    fclose(file);
    if (line)
        free(line);
  
}



void ReadFileforSpecPort(char* FilePath, char* DESC, int PORT){
 FILE* file = fopen(FilePath, "r");
 char * line = NULL;
size_t len = 0;
ssize_t read;

char IntString[sizeof(PORT)];

snprintf(IntString, sizeof(PORT), "%d", PORT);

  if (file == NULL) 
            {   
              printf("Error! Could not open file\n"); 
              exit(-1); // must include stdlib.h 
            } 
while ((read = getline(&line, &len, file)) != -1) {
         if(strstr(line, IntString) != NULL) {
            strcat(DESC, line);

            return;
         };
    }

    fclose(file);
    if (line)
        free(line);

        strcat(DESC, "THIS PORT IS NOT USED");
      return;
}


bool isIpPath(char* Path){

   int isIp = strcmp(Path, "/ports");
   
   if(isIp == 0) return true;

   return false;
}



void CALLBACK(char response[MAXLINE+1], int type, char* Path, int connection, u_int8_t buff[MAXLINE+1]){

   bool isIp = isIpPath(Path);

   char PORTS [MAXLINE+1];

   char RES [MAXLINE+1] = "HTTP/1.1 200 OK\n\r\n\r\n";

   if(isIp) {
   ReadFile("IPS.txt", PORTS);

   //printf("%s", PORTS);

   strcat(RES,PORTS);

   SendResponse(buff,RES, connection);

   memset(RES, 0, MAXLINE);
   memset(PORTS, 0, MAXLINE+1);

   return;

   } 

   char* PathWithoutFirstChar = Path+1;


   if(atoi(PathWithoutFirstChar) == 0) {
      SendResponse(buff,"HTTP/1.1 200 OK\n\r\n\r\nPATH NOT USED", connection);
     return;
   };

   int ReadPort = atoi(PathWithoutFirstChar);

    int nDigits = floor(log10(abs(ReadPort))) + 1;

    if(nDigits < 4){
      SendResponse(buff,"HTTP/1.1 400 Bad Request\n\r\n\r\nNOT A VALID PORT NUMBER", connection);
    return;
    }

   //printf("PORT: %d", ReadPort);


   char DESC [MAXLINE+1];

   ReadFileforSpecPort("IPS.txt",DESC,ReadPort);

   printf("%s", DESC);

   strcat(RES, DESC);

   SendResponse(buff,RES, connection);

   memset(DESC, 0 , MAXLINE);

   memset(RES, 0, MAXLINE);

   return;
}

int main (){
  
    struct sockaddr_in server = InitServer(18000);

    StartServer(server, 18000, CALLBACK);
   
   return 0;
}
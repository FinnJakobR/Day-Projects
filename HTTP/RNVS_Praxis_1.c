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

///TODO: ADD MALLOC WRAPPER UND GEBE EIN 500 ERROR WENN ES EIN MEMORY ERROR GIBT!

#define MAX_HEADER 50
#define MAXLINE 5000
#define ERROR404 "HTTP/1.1 404 Not Found\r\nContent-Type: text/html\r\nContent-Length: 0\r\n\r\n"
#define ERROR501 "HTTP/1.1 501 Not Implemented\r\nContent-Type: text/html\r\nContent-Length: 0\r\n\r\n"
#define ERROR400 "HTTP/1.1 400 Bad Request\r\nContent-Type: text/html\r\nContent-Length: 0\r\n\r\n"
#define SUCESS200 "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 0\r\n\r\n"

typedef enum {
    REQUEST_GET = 0,
    REQUEST_PUT,
    REQUEST_DELETE,
    UNSUPPORTED_REQUEST
}request_type;

typedef struct {
    void* nextElement;
    
     struct {
        char* start;
        char* end;
    }url;

    struct {
        char* start;
        char* end;
    }data;

} dynamic_url_node;



typedef enum {
    DYNMAMIC_URL,
    STATIC_URL,
    UNSUPPORTED_URL
} request_url;

typedef enum {
    NO_ERROR = 0,
    REQUEST_GET_AND_CONTENTLENGTH_ERROR,
    REQUEST_EMPTY_ERROR,
    REQUEST_TYPE_AND_CONTENTLENGTH_ERROR,
    UNVALID_REQUEST_ERROR,
    UNVALID_REQUEST_LINE_ERROR,
} rules_error;

typedef enum {
    HTTP_1_1 = 0,
    UNSUPPORTED_VERSION
} request_version;

typedef struct {
    struct
    {
        char* start;
        char* end;
    }option;

    struct
    {
        char* start;
        char* end;
    }value;
    
    
}request_header;



typedef struct {
    request_header header[MAX_HEADER];
    
    struct{
        char* start;
        char* current_char;
        char* end;
    }source;

        request_type type;

    struct {
        char* start;
        char* end;
        request_url type;
    }url;

    struct {
        char* start;
        char* end;
    }body;
    

    request_version version;

    int lex_error; //zb. wenn eine Request eine falsche Syntax hat
    rules_error rule_error;

}request;



/*Server functions Declarations*/
struct sockaddr_in create_server_instance(char* adresse, int PORT);
void start_server(struct sockaddr_in);
/*----------------------*/

/*Functions to parse HTML Request*/
int tokenize_request(request* req, char* req_source);
int tokenize_request_line(request* req);
int is_end(request* req);
int eat_whitespace(request* req);
int endOfLine(request* req);
int applyContentLengthRule(request* req, request_header* contentLength);
int applyRequestRule(request* req, request_type type, request_header* contentLength);
request_header* findHeaderByName(request* req, char* name);
/*----------------------*/

/*Database functions declarations*/
dynamic_url_node* HEAD = NULL;
void newElement(char* url_start, char* url_end, char* data_start, char* data_end);
void removeElementByUrl(char* url_start);
dynamic_url_node* findElementByUrl(char* url);
/*----------------------*/




/*Main functions init server an start server with cli args*/
int main(int argc, char *argv[] ){
    
    char* adresse = argv[1];
    int port = atoi(argv[2]);
      
    struct sockaddr_in server = create_server_instance(adresse, port);
    

    start_server(server);
    return 0;
};


void newElement(char* url_start, char* url_end, char* data_start, char* data_end){
    dynamic_url_node * newElement = malloc(sizeof(dynamic_url_node));

    if (newElement == NULL) {
        // Fehlerbehandlung für den Fall, dass malloc fehlschlägt
        return;
    }

    size_t url_length = url_end - url_start;
    size_t data_length = data_end - data_start;

    newElement->url.start = malloc(url_length + 1); // +1 für das Nullzeichen
    if (newElement->url.start != NULL) {
        memcpy(newElement->url.start, url_start, url_length);
        newElement->url.start[url_length] = '\0'; // Nullzeichen hinzufügen
        newElement->url.end = newElement->url.start + url_length;
    }

    newElement->data.start = malloc(data_length + 1); // +1 für das Nullzeichen
    if (newElement->data.start != NULL) {
        memcpy(newElement->data.start, data_start, data_length);
        newElement->data.start[data_length] = '\0'; // Nullzeichen hinzufügen
        newElement->data.end = newElement->data.start + data_length;
    }

    if (HEAD == NULL) {
        newElement->nextElement = NULL;
    } else {
        newElement->nextElement = HEAD;
    }
    HEAD = newElement;

    return;
};

void removeElementByUrl(char* url_start){
    dynamic_url_node* currentNode = HEAD;
    dynamic_url_node* prevNode = HEAD;

    while (currentNode != NULL){
    if(memcmp(currentNode->url.start, url_start, currentNode->url.end - currentNode->url.end) == 0){
            
            if(currentNode == HEAD){
                
                HEAD = currentNode->nextElement;
                
                free(currentNode);
                
                return;
            }else{
                
                prevNode->nextElement = currentNode->nextElement;
                free(currentNode->url.start);
                free(currentNode->data.start);
                free(currentNode);
                
                return;
            }
    }

    prevNode = currentNode;
    currentNode = HEAD->nextElement;
   
    }
    return;
}

 dynamic_url_node* findElementByUrl(char* url){
    
    dynamic_url_node* currentElement = HEAD;

    while (currentElement != NULL)
    {
        if(memcmp(currentElement->url.start, url, currentElement->url.end - currentElement->url.start) == 0) return currentElement;

        currentElement = currentElement->nextElement;
    }

    return NULL;
    
 }


struct sockaddr_in create_server_instance(char* adresse, int PORT){
     struct sockaddr_in serveraddr;
     bzero(&serveraddr, sizeof(serveraddr));
     serveraddr.sin_family = AF_INET;
     serveraddr.sin_addr.s_addr = inet_addr(adresse);
     serveraddr.sin_port = htons(PORT);
     return serveraddr;
}

void start_server(struct sockaddr_in server){
     int listenfd, connfd, n;
     char revline[MAXLINE];
    
     if((listenfd = socket(AF_INET,SOCK_STREAM, 0)) < 0){
      printf("Could not init a socket");
      exit(1);   
    }
        int optval = 1;
        if (setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval)) < 0) {
        perror("setsockopt(SO_REUSEADDR) failed");
        close(listenfd);
        exit(EXIT_FAILURE);
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
      //struct sockaddr_in addr;
      //socklen_t addr_len;
      printf("Waiting for connection\n");
      memset(revline, 0, MAXLINE);

      fflush(stdout);

        connfd = accept(listenfd, NULL, NULL);
    if (connfd < 0) {
        perror("Accept failed");
        exit(1);
    }

    request* req = malloc(sizeof(request));

    size_t total_read = 0;
    while ((n = read(connfd, revline, MAXLINE - 1)) > 0) {
        
            fprintf(stdout, "%s", revline);


                     /*ERROR HANDLING*/
             if(!tokenize_request(req,revline)){
                if(req->rule_error == REQUEST_EMPTY_ERROR){
                     write(connfd, "", strlen(""));
                }
                else if(req->type == REQUEST_GET && req->url.type == UNSUPPORTED_URL){
                    write(connfd, ERROR404, strlen(ERROR404));
                }else if(req->url.type == UNSUPPORTED_URL){
                    write(connfd, ERROR501, strlen(ERROR501));
                }else if(req->type == UNSUPPORTED_REQUEST || ((req->type == REQUEST_PUT || req->type == REQUEST_DELETE) && req->url.type != DYNMAMIC_URL)){
                       write(connfd, ERROR501, strlen(ERROR501));
                }else if(req->rule_error == UNVALID_REQUEST_ERROR || req->rule_error == UNVALID_REQUEST_LINE_ERROR){
                    write(connfd, ERROR400, strlen(ERROR400));
                }else if(req->rule_error == REQUEST_TYPE_AND_CONTENTLENGTH_ERROR){
                      write(connfd, ERROR400, strlen(ERROR400));
                }
             };

                    /*----------------------*/

             if(req->url.type == STATIC_URL){
                if(memcmp(req->url.start, "/foo", req->url.end - req->url.start) == 0){
                    
                    char* res = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 3\r\n\r\nFoo";
                    write(connfd, res, strlen(res));
                }
                    else if(memcmp(req->url.start, "/bar", req->url.end - req->url.start) == 0){
                        char* res = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 3\r\n\r\nBar";
                        write(connfd, res, strlen(res));
                }
                    else if (memcmp(req->url.start, "/baz", req->url.end - req->url.start) == 0){
                        char* res = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: 3\r\n\r\nBaz";
                        write(connfd, res, strlen(res));
                }
                    else {
                        
                        write(connfd, ERROR404, strlen(ERROR404)); 
                }
             }

             if(req->url.type == DYNMAMIC_URL){
                
                if(req->type == REQUEST_PUT){
               
                        removeElementByUrl(req->url.start);
                        newElement(req->url.start, req->url.end, req->body.start, req->body.end);
                        char* res = "HTTP/1.1 201 Create resource\r\nContent-Type: text/html\r\nContent-Length: 0\r\n\r\n";
                        write(connfd, res, strlen(res));
               
                }
                
                    else if(req->type == REQUEST_DELETE){
                     
                        removeElementByUrl(req->url.start);
                        write(connfd, SUCESS200, strlen(SUCESS200));

                }
                    else if(req->type == REQUEST_GET){
                        
                        dynamic_url_node* n =  findElementByUrl(req->url.start);
                        
                        if(n){
                            
                            char* res = "HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: %d\r\n\r\n%.*s";
                            
                            int dataLength = n->data.end - n->data.start;
                            int contentLengthSize = snprintf(NULL, 0, "%d", dataLength); // Länge der Zahl für Content-Length
                            int staticPartLength = strlen(res) -6; // Abzug der Länge der Platzhalter %d und %.*s

                            int totalLength = staticPartLength + contentLengthSize + dataLength;
                            char* buff = malloc(sizeof(char) * (totalLength + 1));
                            
                            snprintf(buff,totalLength + 1,  res, dataLength, dataLength, n->data.start);
                            printf("%s", buff);
                            write(connfd, buff, strlen(buff));
                            free(buff);

                    }
                        else {
                         
                            write(connfd, ERROR404, strlen(ERROR404));
                    }
                }
             }



        if (strcmp(&revline[total_read-1], "\r\n\r\n") == 0) {
            free(req);
            break;
        }
    }

    if (n < 0) {
        perror("Read error");
        close(connfd);
        continue;
    }

    //fprintf(stdout, "%zu : %s", total_read, revline);
    close(connfd);
    memset(revline, 0, MAXLINE); // Reset revline for next connection
    }
      
    };



//PARSE HTTP_REQUEST

   int eat_whitespace(request* req){
        while (*(req->source.current_char) == ' '){
            req->source.current_char++;
        }

        return 1;        
    };

    int endOfLine(request* req){

        if((*(req->source.current_char) ==  '\r') && ((req->source.current_char[1]) == '\n')) {
            req->source.current_char +=2;
            return 1;
        }

        return 0;
    }


int tokenize_request_line(request* req){
     
     int request_type_start = req->source.current_char - req->source.start;

    while ((req->source.current_char[0]) != ' '){
        req->source.current_char++;

        if(endOfLine(req)){
            req->lex_error = 1;
            req->rule_error = UNVALID_REQUEST_LINE_ERROR;
            return 0;
        }
    };

    int request_type_end = req->source.current_char - req->source.start;

    if(memcmp(req->source.start + request_type_start, "GET", request_type_end) == 0) {
        req->type = REQUEST_GET;
    }else if(memcmp(req->source.start + request_type_start, "PUT", request_type_end) == 0){
        req->type = REQUEST_PUT;
    }else if(memcmp(req->source.start + request_type_start, "DELETE", request_type_end) == 0){
        req->type = REQUEST_DELETE;
    }else {
        req->lex_error = 1;
        req->type = UNSUPPORTED_REQUEST;
        printf("UNKNOWN REQUEST_TYPE");
        return 0;
    };

    eat_whitespace(req);


    
    req->url.start = req->source.current_char;
    
    while ((req->source.current_char[0]) != ' '){
        req->source.current_char++;

        if(endOfLine(req)){
            req->lex_error = 1;
            req->rule_error = UNVALID_REQUEST_LINE_ERROR;
            return 0;
        }
    };

    req->url.end = req->source.current_char;

    if(memcmp(req->url.start, "/dynamic", strlen("/dynamic")) == 0) {
        req->url.type = DYNMAMIC_URL;
        req->url.start = req->url.start + strlen("/dynamic");
    }else if (memcmp(req->url.start, "/static", strlen("/static")) == 0){
        req->url.type = STATIC_URL;
        req->url.start = req->url.start + strlen("/static");
    }else {
        req->url.type = UNSUPPORTED_URL;
        req->lex_error = 1;
        printf("UNSUPPORTED URL!");
        return 0;
    };

    eat_whitespace(req);


    char* start_of_version = req->source.current_char;

    while(!endOfLine(req)) req->source.current_char ++;

    char* end_of_version = req->source.current_char;

    if(memcmp(start_of_version, "HTTP/1.1", end_of_version - start_of_version)){
        req->version = HTTP_1_1;
    }else{
        req->version = UNSUPPORTED_VERSION;
        req->lex_error = 1;
        return 0;
    };

    return 1;
    

}

int is_end(request* req){
    if(memcmp(req->source.current_char, "\r\n\r\n", strlen("\r\n\r\n")) == 0){
        req->source.current_char += strlen("\r\n\r\n");
        return 1;
    };

    return 0;
}

request_header* findHeaderByName(request* req, char* name){
    for (size_t i = 0; i < (sizeof(req->header) / sizeof(req->header[0])); i++){
        if(memcmp(req->header[i].option.start, name, strlen(name))) return &(req->header[i]);
    }

    return NULL;
    
}


int applyContentLengthRule(request* req, request_header* contentLength){
   if(contentLength && (req->source.current_char  == req->source.end)){
        req->lex_error = 1;
        return 0;
    }

    if(!contentLength && (req->source.current_char  != req->source.end)){
        req->lex_error = 1;
        return 0;
    }

    return 1;
}

int applyRequestRule(request* req, request_type type, request_header* contentLength){
    
        if(type == REQUEST_PUT && !contentLength){
          req->lex_error = 1;
         req->rule_error =  REQUEST_TYPE_AND_CONTENTLENGTH_ERROR;
        return 0;
    }
    
    
    
    if((type == REQUEST_PUT) && (!applyContentLengthRule(req, contentLength))){
        req->lex_error = 1;
        req->rule_error =  REQUEST_TYPE_AND_CONTENTLENGTH_ERROR;
        return 0;
    };

    if((type == REQUEST_GET || type == REQUEST_DELETE) && applyContentLengthRule(req, contentLength)){
        req->lex_error = 1;
        req->rule_error = REQUEST_GET_AND_CONTENTLENGTH_ERROR;
        return 0;
    }

    return 1;
}





int tokenize_request(request* req, char* req_source){


    if(!req){
        printf("COULD NOT ALLOCATE MEMORY FOR REQUEST STRUCT!");
        return 0;
    }


    req->source.start = req_source;

    req->source.end = req->source.start + strlen(req_source);

    req->source.current_char = req->source.start;  

    if(is_end(req) || endOfLine(req)){
        req->lex_error = 1;
        req->rule_error = REQUEST_EMPTY_ERROR;
        return 0;
    }
    

    eat_whitespace(req);

    if(!(tokenize_request_line(req))) return 0;

    memset(req->header, 0,  MAX_HEADER);

    int currentHeaderIndex = 0;


    while (1){

        eat_whitespace(req);

         request_header* newHeader = malloc(sizeof(request_header)); 
              newHeader->option.start = req->source.current_char;
              
              while (*(req->source.current_char) != ':'){
                     req->source.current_char++;
                };

               newHeader->option.end = req->source.current_char;

               if(newHeader->option.start == newHeader->option.end){
                req->lex_error = 1;
                return 0;
               }

               req->source.current_char++;

               eat_whitespace(req);
               
               newHeader->value.start = req->source.current_char;


              while ((*req->source.current_char) != '\r' &&  (*req->source.current_char +1) != '\n'){

                req->source.current_char++;
              
            };

            newHeader->value.end = req->source.current_char;

            if(newHeader->value.start == newHeader->value.end){
                req->lex_error = 1;
                return 0;
            };

            req->header[(currentHeaderIndex)] = *newHeader;

            //printf("NEW HEADER --> %.*s:%.*s\n", (int)(req->header[currentHeaderIndex].option.end - req->header[currentHeaderIndex].option.start),req->header[currentHeaderIndex].option.start,(int)(req->header[currentHeaderIndex].value.end - req->header[currentHeaderIndex].value.start), req->header[currentHeaderIndex].value.start);

            free(newHeader);

            currentHeaderIndex++;


            if(is_end(req)) break;
            else {
                req->source.current_char+=2;
            };


        
    }

    request_header* contentLength = findHeaderByName(req, "Content-Length");
    request_type type = req->type;


    if(!applyRequestRule(req, type, contentLength)) return 0;


    if(type == REQUEST_GET) return 1;

    req->body.start = req->source.current_char;

    while (req->source.current_char != req->source.end){
        req->source.current_char++;
    }

    req->body.end = req->source.current_char;


    return 1;
};


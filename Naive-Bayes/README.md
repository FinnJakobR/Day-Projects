# Naive Bayes Algorithmus
In statistics, naive Bayes classifiers are a family of simple "probabilistic classifiers" based on applying Bayes' theorem with strong (naive) independence assumptions between the features. They are among the simplest Bayesian network models,but coupled with kernel density estimation, they can achieve high accuracy levels
## Motivation
Naive Bayes Algorithm can be used in computer science to binary classify texts. Often the algorithm is used to build artificial intelligences that recognize spam or not spam, or to recognize violent texts. What is special about this algorithm is that it is very easy to implement and shows a basic overview of the subject of artificial intelligence. 

## Some Math
Let be $D_{t}$ = documents with n number of words <br/>
These Words can be shown as a vector $v = (x_{1}...x_{n})$ <br/>
Now you have to calculate the frequency of words in both texts  <br/>
like so: $f_{t} = p(D_{t}|x_{n})$ and save this Data in a Dictionary and your Model is Trained <br/>
Also you have to create a Inital Guess. Means the probability that it can be assigned to a class 
<br/><br/>
To classify the Incomming Document you have the make a new Vektor $v = (x_{1}...x_{n})$ with the words of the incomming Document and compare the probability of the words from the upcoming document and the probability of their occurrence in the two trained classes. <br/>
$$\left \lfloor O_{t} \right \rfloor =\prod_{k=1}^{n}p(D_{t}|x_{n})$$ 

**The Class of the upcomming Document is O**

## More Research 
[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/O2L2Uv9pdDA/0.jpg)](https://www.youtube.com/watch?v=O2L2Uv9pdDA) <br/>
[Wikipedia](https://en.wikipedia.org/wiki/Naive_Bayes_classifier).
## Final Words 
Naive Bayes is a huge Topic in statistics, there are several kinds of Bayes Algorythm and also the shown mathematics only scratches the surface, I recommend you if you want to get further into the matter to visit Wikipedia there everything is described in more detail.

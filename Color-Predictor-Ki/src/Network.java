import java.util.Collection;
import java.util.Collections;
import java.util.List;

public class Network {

    Matrix weights_Input_To_Hidden, weights_Hidden_To_Output;
    Matrix bias_Input_To_Hidden,  bias_Hidden_To_Output;
    double l_rate=0.01;

    public Network(int input, int hidden, int output){
        this.weights_Input_To_Hidden = new Matrix(hidden, input);
        this.weights_Hidden_To_Output = new Matrix(output, hidden);
        this.bias_Input_To_Hidden = new Matrix(hidden,1);
        this.bias_Hidden_To_Output = new Matrix(output,1);
    }

    public List<Double> predict(double[] X){

        //------------------ Hidden To Input --------------------------------------------------//

        Matrix x = Matrix.fromArray(X); //Convertiere die Daten in eine Matrix Schreibweise
        Matrix InputToHidden = Matrix.multiply(weights_Input_To_Hidden, x); //Multipliziere die Weights mit dem Input

        InputToHidden.add(bias_Input_To_Hidden); //Füge dem Berechneten Input der Synapse einen Baies hinzu;

        InputToHidden.sigmoid(); //Packe die Berechnung in die Aktivations function;


        //------------------ Hidden To Output --------------------------------------------------//

        Matrix output = Matrix.multiply(weights_Hidden_To_Output, InputToHidden); //Multiplizere die Weights der Output Synapsen mit dem Input des Hidden Layers

        output.add(bias_Hidden_To_Output); ////Füge dem Berechneten Input der Synapse einen Baies hinzu;

        output.sigmoid(); //Packe die Berechnung in die Aktivations function;


        return output.toArray();
    }

    public void fit(double[][]X,double[][]Y,int epochs)
    {
        for(int i=0;i<epochs;i++)
        {
            int sampleN =  (int)(Math.random() * X.length );
            this.train(X[sampleN], Y[sampleN]);
        }
    }


    //Übergebe die Daten X beschreibt den Wert und Y was am ende Rauskommen soll
    public void train(double [] X,double [] Y) {
        Matrix input = Matrix.fromArray(X); //Konvertiere den Input in eine Matrix


        //-------------- Prediction------------------------------------//

        Matrix hidden = Matrix.multiply(weights_Input_To_Hidden, input);
        hidden.add(bias_Input_To_Hidden);
        hidden.sigmoid();

        Matrix output = Matrix.multiply(weights_Hidden_To_Output, hidden);
        output.add(bias_Hidden_To_Output);
        output.sigmoid();

        //-----------------------------------------------------//

        //-------------- Error Berechnen------------------------------------//

        Matrix target = Matrix.fromArray(Y);

        Matrix error = Matrix.subtract(target, output); // Du berechnest den Error also Matrix Y - output (Also welches Ergebnis nach dem Run kam)

        //-----------------------------------------------------//

        //-------------- Gradinet mithilfe von Backpropagation ------------------------------------//

        Matrix gradient = output.dsigmoid();
        gradient.multiply(error);
        gradient.multiply(l_rate);

        Matrix hidden_T = Matrix.clone(hidden); // Clone die Ergbebnise der Hidden Synapsen
        Matrix who_delta = Matrix.multiply(gradient, hidden_T); // Mutliplizeren den Gradient mit den Ergebnissen (Das ist der Wert, wie die Weights der Output Synapsen erhöht werden müsssen)

        weights_Hidden_To_Output.add(who_delta);
        bias_Hidden_To_Output.add(gradient);


        Matrix who_T = Matrix.clone(weights_Hidden_To_Output);

        Matrix hidden_errors = Matrix.multiply(who_T, error);

        Matrix h_gradient = hidden.dsigmoid();
        h_gradient.multiply(hidden_errors);
        h_gradient.multiply(l_rate);

        Matrix i_T = Matrix.clone(input);
        Matrix wih_delta = Matrix.multiply(h_gradient, i_T);

        weights_Input_To_Hidden.add(wih_delta);
        bias_Input_To_Hidden.add(h_gradient);
        //-----------------------------------------------------//
    }

    public static void main(String[] args) {
        Network n = new Network(3,7,6);

        double[][]X = {{2,10,24},{131,235,65},{81,150,130},{241,245,155},{218,113,178},{96,174,76},{224,239,248},{9,102,237},{36,239,151},{77,247,63},{97,251,98},{7,184,153},{126,107,80},{44,172,111},{209,98,194},{206,11,209},{208,190,199},{46,41,217},{216,28,79},{160,87,153},{195,58,132},{44,71,60},{151,2,82},{105,76,108},{23,197,74},{251,44,87},{217,111,27},{195,43,158},{37,93,240},{129,250,174},{174,146,57},{209,32,194},{133,70,31},{32,49,93},{68,50,83},{172,60,123},{1,107,0},{249,203,168},{109,83,114},{223,34,113},{236,9,201},{67,216,113},{47,250,11},{160,196,229},{43,19,0},{166,99,247},{122,149,2},{171,151,159},{6,76,95},{28,236,6},{134,8,210},{101,244,242},{8,167,71},{130,110,123},{201,120,198},{113,188,38},{183,214,215},{180,247,29},{6,34,249},{132,183,110},{135,9,144},{148,11,224}};
        double[][]Y = {{0,0,0,0,1,0},{0,1,0,0,0,0},{0,1,0,0,0,0},{0,0,0,1,0,0},{0,0,0,0,0,1},{0,1,0,0,0,0},{0,0,1,0,0,0},{0,0,1,0,0,0},{0,1,0,0,0,0},{0,1,0,0,0,0},{0,1,0,0,0,0},{0,1,0,0,0,0},{1,0,0,0,0,0},{0,1,0,0,0,0},{0,0,0,0,0,1},{0,0,0,0,0,1},{0,0,0,1,0,0},{0,0,1,0,0,0},{1,0,0,0,0,0},{0,0,0,0,0,1},{0,0,0,0,0,1},{0,1,0,0,0,0},{1,0,0,0,0,0},{0,0,0,0,0,1},{0,1,0,0,0,0},{1,0,0,0,0,0},{1,0,0,0,0,0},{0,0,0,0,0,1},{0,0,1,0,0,0},{0,1,0,0,0,0},{0,1,0,0,0,0},{0,0,0,0,0,1},{1,0,0,0,0,0},{0,0,1,0,0,0},{0,0,0,0,0,1},{0,0,0,0,0,1},{0,1,0,0,0,0},{0,0,0,1,0,0},{0,0,0,0,0,1},{1,0,0,0,0,0},{0,0,0,0,0,1},{0,1,0,0,0,0},{0,1,0,0,0,0},{0,0,1,0,0,0},{0,0,0,0,1,0},{0,0,0,0,0,1},{0,1,0,0,0,0},{0,0,0,1,0,0},{0,0,1,0,0,0},{0,1,0,0,0,0},{0,0,0,0,0,1},{0,0,1,0,0,0},{0,1,0,0,0,0},{0,0,0,0,0,1},{0,0,0,0,0,1},{0,1,0,0,0,0},{0,0,1,0,0,0},{0,1,0,0,0,0},{0,0,1,0,0,0},{0,1,0,0,0,0},{0,0,0,0,0,1},{0,0,0,0,0,1}};

        System.out.println("I LEARN!!!!");
        n.fit(X,Y,500000);

        List<Double> res = n.predict(new double[]{102,102 ,255});

        double Maximum = Collections.max(res);


        System.out.println("MAX: " + Maximum);


        String[]  Pres = {"RED", "GREEN", "BLUE", "WHITE", "BLACK", "PURPLE"};




        for (int i = 0; i < res.size(); i++) {
            if(Maximum == res.get(i) ){
                System.out.println("KI SAYS ITS " + Pres[i]);
            }
        }
    }

}

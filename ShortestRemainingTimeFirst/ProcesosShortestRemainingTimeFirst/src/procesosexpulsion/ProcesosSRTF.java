package procesosexpulsion;
 
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.swing.BorderFactory;
import javax.swing.Icon;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.WindowConstants;

public class ProcesosSRTF extends JFrame implements Runnable, ActionListener {

    JScrollPane scrollPane = new JScrollPane();
    JScrollPane scrollPane1 = new JScrollPane();

    JScrollPane scrollPane2 = new JScrollPane();
    JScrollPane scrollPane3 = new JScrollPane();

    JScrollPane scrollPane4 = new JScrollPane();
    JScrollPane scrollPane5 = new JScrollPane();

    JLabel semaforo = new JLabel();

    JLabel label1 = new JLabel("Nombre proceso: ");
    JLabel labelRafaga = new JLabel ("Rafaga Proceso: ");
    JLabel label3 = new JLabel("Proceso en ejecucion: Ninguno");
    JLabel label4 = new JLabel("Tiempo ejecucion: ");
    JLabel label5 = new JLabel("Tabla de procesos:");
    JLabel label6 = new JLabel("Diagrama de Gantt:");
    JLabel label7 = new JLabel("Procesos en espera:");
    JLabel labelSemaforo = new JLabel("Semaforo Binario");

    JButton botonIngresar = new JButton("Ingresar proceso");
    JButton botonIniciar = new JButton("Iniciar ejecucion");
    JButton botonBloquear = new JButton("Bloquear proceso");

    JTextField tfNombre = new JTextField("Proceso 1");
    JTextField tfRafaga = new JTextField ("");

    JTextField[][] tabla = new JTextField[100][7];
    JTextField[][] tablaBloqueados = new JTextField[100][3];
    JLabel[][] diagrama = new JLabel[40][100];

    ListaCircular cola = new ListaCircular();

    Nodo nodoEjecutado;

    int filas = 0, rafagaTemporal;
    int tiempoGlobal = 0;
    int coorX = 0;

    Thread procesos;
    Thread bloqueos;
    

    public static void main(String[] args) {

        ProcesosSRTF pe = new ProcesosSRTF();
        pe.setBounds(0, 0, 1200, 730);
        pe.setTitle("SRTF");
        pe.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);
        pe.setVisible(true);

    }

    ProcesosSRTF() {

        Container c = getContentPane();
        c.setLayout(null);
        this.getContentPane().setBackground(new Color(152,251,152));

        c.add(label1);
        c.add(labelRafaga);
        c.add(label3);
        c.add(label4);
        c.add(label5);
        c.add(label6);
        c.add(label7);
        c.add(labelSemaforo);
        c.add(semaforo);

        c.add(scrollPane1);
        c.add(scrollPane3);
        c.add(scrollPane5);

        c.add(botonIngresar);
        c.add(botonIniciar);
        c.add(botonBloquear);

        c.add(tfNombre);
        c.add(tfRafaga);
        
        botonIngresar.setBorder(BorderFactory.createBevelBorder(0, Color.green, Color.orange, Color.red, Color.blue));
        botonIniciar.setBorder(BorderFactory.createBevelBorder(0, Color.green, Color.orange, Color.red, Color.blue));
        botonBloquear.setBorder(BorderFactory.createBevelBorder(0, Color.green, Color.orange, Color.red, Color.blue));

        label1.setBounds(90, 545, 300, 20);
        labelRafaga.setBounds(280,545,300,20);
        label3.setBounds(850, 620, 300, 20);
        label4.setBounds(850, 640, 300, 20);
        label5.setBounds(260, 20, 300, 20);//tabla de procesos
        label6.setBounds(70, 280, 300, 20);//tabla de gantt
        label7.setBounds(850, 480, 300, 20);//tabla espera
        labelSemaforo.setBounds(1020,20,300,20);
        
        Font times = new Font("Times New Roman",1,20);
        
        label1.setFont(times);
        labelRafaga.setFont(times);
        label3.setFont(times);
        label4.setFont(times);
        label5.setFont(times);
        label6.setFont(times);
        label7.setFont(times);
        labelSemaforo.setFont(new Font("Times New Roman",1,15));
        

        scrollPane.setBounds(50, 40, 2500, 2500);
        scrollPane.setPreferredSize(new Dimension(2500, 2500));
        scrollPane.setBackground(Color.WHITE);

        scrollPane1.setBounds(260, 40, 600, 240);
        scrollPane1.setPreferredSize(new Dimension(1150, 400));
        scrollPane1.setBackground(Color.WHITE);

        scrollPane2.setBounds(230, 300, 5000, 2500);
        scrollPane2.setPreferredSize(new Dimension(5000, 2500));
        scrollPane2.setBackground(Color.WHITE);

        scrollPane3.setBounds(70, 300, 1000, 180);
        scrollPane3.setPreferredSize(new Dimension(5000, 400));
        scrollPane3.setBackground(Color.WHITE);

        scrollPane4.setBounds(800, 300, 5000, 1000);
        scrollPane4.setPreferredSize(new Dimension(5000, 1000));
        scrollPane4.setBackground(Color.WHITE);

        scrollPane5.setBounds(800, 500, 350, 100);
        scrollPane5.setPreferredSize(new Dimension(350, 350));
        scrollPane5.setBackground(Color.WHITE);

        tfNombre.setBounds(90, 565, 150, 30);
        tfRafaga.setBounds(280,565,150,30);

        botonIngresar.addActionListener(this);
        botonIngresar.setBounds(60, 600, 200, 40);
        botonIngresar.setBackground(Color.CYAN);

        botonIniciar.addActionListener(this);
        botonIniciar.setBounds(270, 600, 200, 40);
        botonIniciar.setBackground(Color.GREEN);

        botonBloquear.addActionListener(this);
        botonBloquear.setBounds(480, 600, 200, 40);
        botonBloquear.setBackground(Color.RED);

        dibujarSemaforo("Verde.png");

    }

    public void dibujarSemaforo(String color) {

        JLabel img = new JLabel();

        ImageIcon imgIcon = new ImageIcon(getClass().getResource(color));

        Image imgEscalada = imgIcon.getImage().getScaledInstance(130, 200, Image.SCALE_SMOOTH);
        Icon iconoEscalado = new ImageIcon(imgEscalada);
        semaforo.setBounds(1020, 40, 130, 200);
        semaforo.setIcon(iconoEscalado);

    }

    public void dibujarTabla(String nombre, int rafaga, int tiempo) {

        scrollPane.removeAll();

        JLabel texto1 = new JLabel("Proceso");
        JLabel texto2 = new JLabel("T. llegada");
        JLabel texto3 = new JLabel("Rafaga");
        JLabel texto4 = new JLabel("T. comienzo");
        JLabel texto5 = new JLabel("T. final");
        JLabel texto6 = new JLabel("T. retorno");
        JLabel texto7 = new JLabel("T. espera");

        texto1.setBounds(20, 20, 150, 20);
        texto2.setBounds(100, 20, 150, 20);
        texto3.setBounds(180, 20, 150, 20);
        texto4.setBounds(260, 20, 150, 20);
        texto5.setBounds(340, 20, 150, 20);
        texto6.setBounds(420, 20, 150, 20);
        texto7.setBounds(500, 20, 150, 20);
        

        scrollPane.add(texto1);
        scrollPane.add(texto2);
        scrollPane.add(texto3);
        scrollPane.add(texto4);
        scrollPane.add(texto5);
        scrollPane.add(texto6);
        scrollPane.add(texto7);

        for (int i = 0; i < filas; i++) {

            for (int j = 0; j < 7; j++) {

                if (tabla[i][j] != null) {

                    scrollPane.add(tabla[i][j]);

                } else {

                    tabla[i][j] = new JTextField();
                    tabla[i][j].setBounds(20 + (j * 80), 40 + (i * 25), 70, 20);
                    tabla[i][j].setEditable(false);
                    tabla[i][j].setBorder(javax.swing.BorderFactory.createEmptyBorder());
                    tabla[i][j].setBackground(Color.WHITE);

                    scrollPane.add(tabla[i][j]);

                }

            }

        }

        tabla[filas - 1][0].setText(nombre);
        tabla[filas - 1][1].setText(Integer.toString(tiempo));
        tabla[filas - 1][2].setText(Integer.toString(rafaga));
        
        
        scrollPane.repaint();
        scrollPane1.setViewportView(scrollPane);

    }

    public void llenarBloqueados() {

        scrollPane4.removeAll();

        JLabel texto1 = new JLabel("Proceso");
        JLabel texto2 = new JLabel("T. llegada");
        JLabel texto3 = new JLabel("Rafaga");

        texto1.setBounds(20, 20, 150, 20);
        texto2.setBounds(100, 20, 150, 20);
        texto3.setBounds(180, 20, 150, 20);

        scrollPane4.add(texto1);
        scrollPane4.add(texto2);
        scrollPane4.add(texto3);

        if (cola.getCabeza() != null) {

            Nodo temp = cola.getCabeza().getSiguiente();

            for (int i = 0; i < cola.getTamaño() - 1; i++) {

                for (int j = 0; j < 3; j++) {

                    tablaBloqueados[i][j] = new JTextField("");
                    tablaBloqueados[i][j].setBounds(20 + (j * 80), 40 + (i * 25), 70, 20);
                    tablaBloqueados[i][j].setBorder(javax.swing.BorderFactory.createEmptyBorder());
                    tablaBloqueados[i][j].setBackground(Color.WHITE);
                    

                    scrollPane4.add(tablaBloqueados[i][j]);

                }

                tablaBloqueados[i][0].setText(temp.getLlave());
                tablaBloqueados[i][1].setText(tablaBloqueados[i][1].getText() + "," + Integer.toString(temp.getLlegada()));
                tablaBloqueados[i][2].setText(Integer.toString(temp.getRafaga()));

                temp = temp.getSiguiente();

            }

        }

        scrollPane4.repaint();
        scrollPane5.setViewportView(scrollPane4);

    }

    public void llenarRestante() {
        //Original
        //tabla[nodoEjecutado.getIndice() - 1][3].setText(tabla[nodoEjecutado.getIndice() - 1][3].getText() + "," + Integer.toString(nodoEjecutado.getComienzo()));
        //tabla[nodoEjecutado.getIndice() - 1][4].setText(tabla[nodoEjecutado.getIndice() - 1][4].getText() + "," + Integer.toString(nodoEjecutado.getFinalizacion()));
        //tabla[nodoEjecutado.getIndice() - 1][5].setText(Integer.toString(nodoEjecutado.getFinalizacion() - nodoEjecutado.getLlegada()));
        
        //Para evitar sobreescribir el campo de tiempo inicial
        if(tabla[nodoEjecutado.getIndice() - 1][3].getText().isEmpty()){
            System.out.println("esta vacio");
            tabla[nodoEjecutado.getIndice() - 1][3].setText(Integer.toString(nodoEjecutado.getComienzo()));
        }else{
            System.out.println("tiene algo");
        }        
        tabla[nodoEjecutado.getIndice() - 1][4].setText(Integer.toString(nodoEjecutado.getFinalizacion()));        
        tabla[nodoEjecutado.getIndice() - 1][5].setText(Integer.toString(nodoEjecutado.getFinalizacion() - nodoEjecutado.getLlegada()));
        //tabla[nodoEjecutado.getIndice() - 1][6].setText(Integer.toString((nodoEjecutado.getFinalizacion() - nodoEjecutado.getLlegada())- nodoEjecutado.getRafaga()));
        
        String[] comienzos = tabla[nodoEjecutado.getIndice() - 1][3].getText().split(",");
        String[] finales = tabla[nodoEjecutado.getIndice() - 1][4].getText().split(",");
        finales[0] = "0";
        String cadena = "";

        for (int i = 1; i < comienzos.length; i++) {

            cadena = cadena + (Integer.parseInt(comienzos[i]) - Integer.parseInt(finales[i - 1]));

        }
        int retorno = Integer.valueOf(tabla[nodoEjecutado.getIndice() - 1][5].getText());
        int rafaga = Integer.valueOf(tabla[nodoEjecutado.getIndice() - 1][2].getText());
        int espera = retorno - rafaga;
        
        tabla[nodoEjecutado.getIndice() - 1][6].setText(Integer.toString(espera));

    }

    public void dibujarDiagrama(String nombre, int coorX, int coorY) {

        scrollPane2.removeAll();

        for (int i = 0; i < 100; i++) {

            diagrama[0][i] = new JLabel(Integer.toString(i));
            diagrama[0][i].setBounds(80 + (i * 20), 20, 20, 20);

            scrollPane2.add(diagrama[0][i]);

        }

        diagrama[nodoEjecutado.getIndice()][0] = new JLabel("  " + nombre);
        diagrama[nodoEjecutado.getIndice()][0].setBounds(0, 20 + (nodoEjecutado.getIndice() * 20), 80, 20);

        scrollPane2.add(diagrama[nodoEjecutado.getIndice()][0]);

        JLabel img = new JLabel();

        ImageIcon imgIcon = new ImageIcon(getClass().getResource("barraEjecucion.jpg"));

        Image imgEscalada = imgIcon.getImage().getScaledInstance(20, 20, Image.SCALE_SMOOTH);
        Icon iconoEscalado = new ImageIcon(imgEscalada);

        for (int i = 1; i < filas + 1; i++) {

            for (int j = 0; j < coorX + 1; j++) {

                if (diagrama[i][j] != null) {

                    scrollPane2.add(diagrama[i][j]);

                }

            }

        }

        diagrama[nodoEjecutado.getIndice()][coorX + 1] = new JLabel();
        diagrama[nodoEjecutado.getIndice()][coorX + 1].setBounds(80 + (coorX * 20), 20 + (nodoEjecutado.getIndice() * 20), 20, 20);
        diagrama[nodoEjecutado.getIndice()][coorX + 1].setIcon(iconoEscalado);

        scrollPane2.add(diagrama[nodoEjecutado.getIndice()][coorX + 1]);

        scrollPane2.repaint();
        scrollPane3.setViewportView(scrollPane2);

    }

    public void ingresar(String nombre, int rafaga, int tiempo, int filas) {

        cola.insertar(nombre, rafaga, tiempo, filas);

    }

    public void ordenarRafagasRestantes() {
        int movimientos = 0;
        int contador = 0;

        Nodo temp = cola.getCabeza().getSiguiente();

        int menorRaf = cola.getCabeza().getRafaga(); //ORIGINAL

        while (!(temp.equals(cola.getCabeza()))) {

            contador++;

            if (temp.getRafaga() < menorRaf) {

                menorRaf = temp.getRafaga();
                movimientos = contador;

            }

            temp = temp.getSiguiente();

        }

        for (int i = 0; i < movimientos; i++) {

            cola.intercambiar(cola.getCabeza());

        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == botonIngresar) {

            filas++;

            String nombre = tfNombre.getText();
            rafagaTemporal = Integer.parseInt(tfRafaga.getText());

            ingresar(nombre, rafagaTemporal, tiempoGlobal, filas);
            dibujarTabla(nombre, rafagaTemporal, tiempoGlobal);

            tfNombre.setText("Proceso" + (filas + 1));

        } else if (e.getSource() == botonIniciar) {

            procesos = new Thread(this);
            procesos.start();

        } else if (e.getSource() == botonBloquear) {

            if (nodoEjecutado.getRafaga() != 0) {
                
                filas++;
                ingresar(nodoEjecutado.getLlave() + "*", nodoEjecutado.getRafaga(), tiempoGlobal, filas);
                dibujarTabla(nodoEjecutado.getLlave() + "*", nodoEjecutado.getRafaga(), tiempoGlobal);
                nodoEjecutado.setFinalizacion(tiempoGlobal);
                llenarRestante();
                cola.eliminar(cola.getCabeza());
                llenarBloqueados();
                nodoEjecutado = cola.getCabeza();
                nodoEjecutado.setComienzo(tiempoGlobal);

            }
        }

    }

    @Override
    public void run() {
                
        try {

            while (cola.getTamaño() != 0) {

                dibujarSemaforo("Rojo.jpg");

                ordenarRafagasRestantes();
                //NODO ACTUAL
                nodoEjecutado = cola.getCabeza();
                nodoEjecutado.setComienzo(tiempoGlobal);
                
                
                int tiempoEjecutado = 0;
                
                
                //Funcionalidad de SRTF para el proceso que este en cabeza de la cola
                while (nodoEjecutado.getRafaga() > 0 && tiempoEjecutado < 1) {

                    //Llama a este metodo en cada incremento del tiempo para reorganizar todo              
                    ordenarRafagasRestantes();

                    nodoEjecutado.setRafaga(nodoEjecutado.getRafaga() - 1);

                    label3.setText("Proceso en ejecucion: " + nodoEjecutado.getLlave());
                    label4.setText("Tiempo de ejecucion: " + String.valueOf(tiempoGlobal) + " Segundos.");

                    dibujarDiagrama(nodoEjecutado.getLlave(), coorX, nodoEjecutado.getIndice());
                    llenarBloqueados();

                    tiempoGlobal++;
                    coorX++;
                    tiempoEjecutado++; //Hace que se tenga que salir del while cada segundo para tener
                    //que volver a organizar las rafagas

                    try {
                        Thread.sleep(1000);

                    } catch (InterruptedException ex) {
                        Logger.getLogger(ProcesosSRTF.class.getName()).log(Level.SEVERE, null, ex);
                    }

                }

                //Finalización de la ejecución del proceso actual
                nodoEjecutado.setFinalizacion(tiempoGlobal);
                llenarRestante();
                if (nodoEjecutado.getRafaga() == 0) {
                    try{
                        dibujarSemaforo("Verde.png");
                        Thread.sleep(1000);
                        cola.eliminar(cola.getCabeza());
                    }
                    catch (Exception e){
                        
                    }
                    
                }
                llenarBloqueados();
                

            }

            dibujarSemaforo("Verde.png");
            label3.setText("Proceso en ejecucion: Ninguno");

        } catch (Exception e) {

            System.out.print("No se que poner aca :D");

        }

    }

}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlet;

import dao.UserDAO;
import entity.User;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Franco
 */
public class Login extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet Login</title>");            
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet Login at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        //Create return variables
        HttpSession session = request.getSession();
        String destination = "index.jsp";
        String message = "";
        String login = "bad";

        //Get login details
        String uname = request.getParameter("uname");
        String pword = request.getParameter("pword");
        UserDAO userDAO = new UserDAO();

        //Check if uname and pword are null
        if (uname == null || uname.isEmpty() || pword == null || pword.isEmpty()) {
            message = "Please enter a username and a password";
        } else {
            //Try the login
            User user = userDAO.Login(uname, pword);
            if (user == null) {
                message = "Incorrect username and password";
            } else {
                //Set the destination of message.jsp
                switch (user.getClassID()) {
                    case 1: //Admin
                        destination = "ADHome";
                        break;
                    case 2: //Analyst
                        destination = "ANHome";
                        break;
                    case 3: //Encoder
                        destination = "ENHome";
                        break;
                }

                //Set Session Variables
                login = "good";
                session.setAttribute("classID", user.getClassID());
                session.setAttribute("userUname", user.getUname());
                session.setAttribute("userFullName", user.getNavName());
                session.setAttribute("userID", user.getId());
            }
        }

        session.setAttribute("message", message);
        session.setAttribute("login", login);
        request.setAttribute("destination", destination);

        ServletContext servcont = getServletContext();
        RequestDispatcher dispatch = servcont.getRequestDispatcher("/message.jsp");
        dispatch.forward(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}

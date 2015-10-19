/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package dao;

import db.DBConnector;
import entity.Area;
import entity.COG;
import entity.EEntity;
import entity.IntTuple;
import entity.Mission;
import entity.Task;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import utility.ShieldUtility;

/**
 *
 * @author Franco
 */
public class MissionDAO {

    ShieldUtility su = new ShieldUtility();

    //Mission
    public Mission GetMission(int missionID) { //Clear
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_mission`(?);");
            pstmt.setInt(1, missionID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();

            if (rs.getRow() == 0) {
                cn.close();
                return null;
            } else {
                Mission mson = new Mission();
                Area area = new Area();
                ArrayList<String> objectiveKeywordList = new ArrayList<String>();
                ArrayList<String> situationKeywordList = new ArrayList<String>();
                ArrayList<String> executionKeywordList = new ArrayList<String>();
                ArrayList<String> adminAndLogisticsKeywordList = new ArrayList<String>();
                ArrayList<String> commandAndSignalKeywordList = new ArrayList<String>();

                mson.setId(missionID);
                mson.setTitle(rs.getString(1));
                mson.setThreat(rs.getString(2));
                mson.setObjective(rs.getString(3));
                mson.setSituation(rs.getString(4));
                mson.setExecution(rs.getString(5));
                mson.setAdminAndLogistics(rs.getString(6));
                mson.setCommandAndSignal(rs.getString(7));
                mson.setUserID(rs.getInt(8));
                area.setLevel8(rs.getString(9));
                area.setLevel7(rs.getString(10));
                area.setLevel6(rs.getString(11));
                area.setLevel5(rs.getString(12));
                area.setLevel4(rs.getString(13));
                area.setLevel3(rs.getString(14));
                area.setLevel2(rs.getString(15));
                area.setLevel1(rs.getString(16));
                area.setLat(rs.getDouble(17));
                area.setLng(rs.getDouble(18));
                mson.setArea(area);

                //get keywords
                pstmt = cn.prepareStatement("CALL `shield`.`get_all_keyword_mission`(?);");
                pstmt.setInt(1, missionID);
                rs = pstmt.executeQuery();
                rs.next();
                if (rs.getRow() != 0) {
                    do {
                        int classID = rs.getInt(2);
                        switch (classID) {
                            case 1:
                                objectiveKeywordList.add(rs.getString(3));
                                break;
                            case 2:
                                situationKeywordList.add(rs.getString(3));
                                break;
                            case 3:
                                executionKeywordList.add(rs.getString(3));
                                break;
                            case 4:
                                adminAndLogisticsKeywordList.add(rs.getString(3));
                                break;
                            case 5:
                                commandAndSignalKeywordList.add(rs.getString(3));
                                break;
                        }
                    } while (rs.next());

                    mson.setObjectiveKeywordList(objectiveKeywordList);
                    mson.setSituationKeywordList(situationKeywordList);
                    mson.setExecutionKeywordList(executionKeywordList);
                    mson.setAdminAndLogisticsKeywordList(adminAndLogisticsKeywordList);
                    mson.setCommandAndSignalKeywordList(commandAndSignalKeywordList);
                }

                cn.close();
                return mson;
            }
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return null;
    }

    public int GetMissionStatus(int missionID) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_mission_status`(?);");
            pstmt.setInt(1, missionID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            if (rs.getRow() == 0) {
                cn.close();
                return 0;
            } else {
                int missionStatus = rs.getInt(1);
                cn.close();

                return missionStatus;
            }
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return 0;
    } //Clear

    public ArrayList<Mission> GetAllMissions() {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_all_mission`();");
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            if (rs.getRow() == 0) {
                cn.close();
                return null;
            } else {
                ArrayList<Mission> msonList = new ArrayList<Mission>();
                do {
                    Mission mson = new Mission();
                    Area area = new Area();

                    mson.setId(rs.getInt(1));
                    mson.setStatus(rs.getInt(2));
                    mson.setTitle(rs.getString(3));
                    mson.setStartDT(rs.getDate(4));
                    mson.setEndDT(rs.getDate(5));
                    area.setLevel8(rs.getString(6));
                    area.setLevel7(rs.getString(7));
                    area.setLevel6(rs.getString(8));
                    area.setLevel5(rs.getString(9));
                    area.setLevel4(rs.getString(10));
                    area.setLevel3(rs.getString(11));
                    area.setLevel2(rs.getString(12));
                    area.setLevel1(rs.getString(13));
                    mson.setArea(area);;

                    msonList.add(mson);
                } while (rs.next());

                cn.close();
                return msonList;
            }

        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    } //Clear

    public ArrayList<Mission> GetAllOngoingMissionOfUser(int userID) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_all_mission_ongoing_user`(?);");
            pstmt.setInt(1, userID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            if (rs.getRow() == 0) {
                cn.close();
                return null;
            } else {
                ArrayList<Mission> msonList = new ArrayList<Mission>();
                do {
                    Mission mson = new Mission();
                    Area area = new Area();

                    mson.setId(rs.getInt(1));
                    mson.setStatus(rs.getInt(2));
                    mson.setTitle(rs.getString(3));
                    mson.setStartDT(rs.getDate(4));
                    mson.setEndDT(rs.getDate(5));
                    area.setLevel8(rs.getString(6));
                    area.setLevel7(rs.getString(7));
                    area.setLevel6(rs.getString(8));
                    area.setLevel5(rs.getString(9));
                    area.setLevel4(rs.getString(10));
                    area.setLevel3(rs.getString(11));
                    area.setLevel2(rs.getString(12));
                    area.setLevel1(rs.getString(13));
                    mson.setArea(area);

                    msonList.add(mson);
                } while (rs.next());

                cn.close();
                return msonList;
            }

        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    } // Clear

    public int AddMission(Mission mson) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            Area area = mson.getArea();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`add_mission`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);");
            pstmt.setInt(1, mson.getUserID());
            pstmt.setString(2, mson.getTitle());
            pstmt.setString(3, area.getLevel8());
            pstmt.setString(4, area.getLevel7());
            pstmt.setString(5, area.getLevel6());
            pstmt.setString(6, area.getLevel5());
            pstmt.setString(7, area.getLevel4());
            pstmt.setString(8, area.getLevel3());
            pstmt.setString(9, area.getLevel2());
            pstmt.setString(10, area.getLevel1());
            pstmt.setDouble(11, area.getLat());
            pstmt.setDouble(12, area.getLng());

            ResultSet rs = pstmt.executeQuery();
            rs.next();

            if (rs.getRow() == 0) {
                cn.close();
                return -1;
            } else {
                return rs.getInt(1);
            }
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return -1;
    } //Clear

    public int AdvanceMissionStatus(int missionID) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`advance_mission_status`(?);");
            pstmt.setInt(1, missionID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            if (rs.getRow() == 0) {
                cn.close();
                return -1;
            } else {
                int status = rs.getInt(1);
                cn.close();
                return status;
            }
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return -1;
    } //Clear

    public boolean UpdateMission(int editorID, Mission mson) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`update_mission`(?, ?, ?, ?, ?, ?, ?, ?, ?);");
            pstmt.setInt(1, mson.getUserID());
            pstmt.setInt(2, mson.getId());
            pstmt.setString(3, mson.getTitle());
            pstmt.setString(4, mson.getThreat());
            pstmt.setString(5, mson.getObjective());
            pstmt.setString(6, mson.getSituation());
            pstmt.setString(7, mson.getExecution());
            pstmt.setString(8, mson.getAdminAndLogistics());
            pstmt.setString(9, mson.getCommandAndSignal());

            ResultSet rs = pstmt.executeQuery();
            rs.next();

            if (rs.getRow() == 0) {
                cn.close();
                return false;
            } else {
                pstmt = cn.prepareStatement("CALL `shield`.`unlink_all_keyword_mission`(?);");
                pstmt.setInt(1, mson.getId());
                pstmt.execute();
                pstmt = cn.prepareStatement("CALL `shield`.`link_keyword_mission`(?, ?, ?);");
                pstmt.setInt(1, mson.getId());
                ArrayList<String> keyList = mson.getObjectiveKeywordList();
                if (!su.ListIsNullOrEmpty(keyList)) {
                    pstmt.setInt(2, 1);
                    for (String s : keyList) {
                        pstmt.setString(3, s);
                        pstmt.executeUpdate();
                    }
                }
                keyList = mson.getSituationKeywordList();
                if (!su.ListIsNullOrEmpty(keyList)) {
                    pstmt.setInt(2, 2);
                    for (String s : keyList) {
                        pstmt.setString(3, s);
                        pstmt.executeUpdate();
                    }
                }
                keyList = mson.getExecutionKeywordList();
                if (!su.ListIsNullOrEmpty(keyList)) {
                    pstmt.setInt(2, 3);
                    for (String s : keyList) {
                        pstmt.setString(3, s);
                        pstmt.executeUpdate();
                    }
                }
                keyList = mson.getAdminAndLogisticsKeywordList();
                if (!su.ListIsNullOrEmpty(keyList)) {
                    pstmt.setInt(2, 4);
                    for (String s : keyList) {
                        pstmt.setString(3, s);
                        pstmt.executeUpdate();
                    }
                }
                keyList = mson.getCommandAndSignalKeywordList();
                if (!su.ListIsNullOrEmpty(keyList)) {
                    pstmt.setInt(2, 5);
                    for (String s : keyList) {
                        pstmt.setString(3, s);
                        pstmt.executeUpdate();
                    }
                }

                cn.close();
                return true;
            }
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    } //Clear

    // COG 
    public COG GetCOGOfMission(int missionID) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_cog_mission`(?);");
            System.out.println(missionID);
            pstmt.setInt(1, missionID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();

            COG cog = new COG();

            if (rs.getRow() == 0) {
                //New Cog
                pstmt = cn.prepareStatement("CALL `shield`.`get_all_eentity_mission`(?)");
                pstmt.setInt(1, missionID);
                rs = pstmt.executeQuery();
                rs.next();
                if (rs.getRow() != 0) {
                    ArrayList<EEntity> eentList = new ArrayList<EEntity>();
                    do {
                        EEntity eent = new EEntity();
                        eent.setId(rs.getInt(1));
                        eent.setName(rs.getString(2));
                        eentList.add(eent);
                    } while (rs.next());

                    cog.setEentList(eentList);
                } else {
                    cn.close();
                    System.out.println("null1");
                    return null;
                }
            } else {
                //Cog already exists
                cog.setMissionID(missionID);
                cog.setNodeJSON(rs.getString(1));
                cog.setEdgeJSON(rs.getString(2));

            }
            cn.close();
            return cog;
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        System.out.println("null2");
        return null;
    }

    public boolean AddCOG(COG cog) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`delete_all_eentity_ext_mission`(?);");
            pstmt.setInt(1, cog.getMissionID());
            pstmt.execute();
            pstmt = cn.prepareStatement("CALL `shield`.`add_cog`(?, ?, ?);");
            pstmt.setInt(1, cog.getMissionID());
            pstmt.setString(2, cog.getNodeJSON());
            pstmt.setString(3, cog.getEdgeJSON());
            pstmt.execute();

            pstmt = cn.prepareStatement("CALL `shield`.`add_eentity_ext`(?, ?, ?);");
            pstmt.setInt(2, cog.getMissionID());

            //CC
            pstmt.setInt(3, 3);
            for (EEntity cc : cog.getCcList()) {
                pstmt.setInt(1, cc.getId());
                pstmt.execute();
            }

            //CR
            pstmt.setInt(3, 4);
            for (EEntity cr : cog.getCrList()) {
                pstmt.setInt(1, cr.getId());
                pstmt.execute();
            }

            //CV
            pstmt.setInt(3, 5);
            for (EEntity cv : cog.getCvList()) {
                pstmt.setInt(1, cv.getId());
                pstmt.execute();
            }

            //CC-CR
            PreparedStatement pstmt2 = cn.prepareStatement("CALL `shield`.`link_cc_cr`(?, ?);");
            for (IntTuple it : cog.getRelCRList()) {
                pstmt2.setInt(1, it.getX());
                pstmt2.setInt(2, it.getY());
                pstmt2.execute();
            }

            //CR-CV
            pstmt2 = cn.prepareStatement("CALL `shield`.`link_cr_cv`(?, ?);");
            for (IntTuple it : cog.getRelRVList()) {
                pstmt2.setInt(1, it.getX());
                pstmt2.setInt(2, it.getY());
                pstmt2.execute();
            }

            return true;
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    }

    public ArrayList<Integer> GetEEntityIDsOfCC(int ccID) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_all_cr_cc`(?)");
            pstmt.setInt(1, ccID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            ArrayList<Integer> crList;

            if (rs.getRow() == 0) {
                cn.close();
                return null;
            } else {
                crList = new ArrayList<Integer>();
                do {
                    if (!crList.contains(rs.getInt(1))) {
                        crList.add(rs.getInt(1));
                    }
                } while (rs.next());
            }

            ArrayList<Integer> idList = new ArrayList<Integer>();
            pstmt = cn.prepareStatement("CALL `shield`.`get_all_cv_cr`(?)");
            for (int id : crList) {
                pstmt.setInt(1, id);
                rs = pstmt.executeQuery();
                rs.next();
                if (rs.getRow() != 0) {
                    do {
                        if (!idList.contains(rs.getInt(1))) {
                            idList.add(rs.getInt(1));
                        }
                    } while (rs.next());
                }
                if (!idList.contains(id)) {
                    idList.add(id);
                }
            }
            idList.add(ccID);
            cn.close();
            return idList;
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    public ArrayList<Integer> GetEEntityIDsOfCR(int crID) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`get_all_cv_cr`(?)");
            pstmt.setInt(1, crID);
            ResultSet rs = pstmt.executeQuery();
            rs.next();
            ArrayList<Integer> crList;

            if (rs.getRow() == 0) {
                cn.close();
                return null;
            } else {
                crList = new ArrayList<Integer>();
                do {
                    if (!crList.contains(rs.getInt(1))) {
                        crList.add(rs.getInt(1));
                    }
                } while (rs.next());
                crList.add(crID);
            }

            cn.close();
            return crList;
        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }

        return null;
    }

    //
    public boolean UpdateCVOfMission(int missionID, ArrayList<EEntity> cvList) {
        try {
            DBConnector db = new DBConnector();
            Connection cn = db.getConnection();

            PreparedStatement pstmt = cn.prepareStatement("CALL `shield`.`update_cv`(?, ?, ?, ?, ?, ?, ?);");

            for (EEntity e : cvList) {
                pstmt.setInt(1, e.getId());
                pstmt.setInt(2, e.getCrit());
                pstmt.setInt(3, e.getAcce());
                pstmt.setInt(4, e.getRecu());
                pstmt.setInt(5, e.getVuln());
                pstmt.setInt(6, e.getEffe());
                pstmt.setInt(7, e.getReco());

                pstmt.executeUpdate();
            }

            return true;

        } catch (SQLException ex) {
            Logger.getLogger(MissionDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    }
}

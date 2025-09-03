using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using QUESTIONPAPER_QUIZ.Models;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using static System.Collections.Specialized.BitVector32;

namespace QUESTIONPAPER_QUIZ.Controllers
{
    public class HomeController : Controller
    {
        Utility util = new Utility();
        private readonly IMemoryCache _cache;

        public string host = "";

        public static string ISSMTPSERVER = "mx.mailguru.biz";
        public static int ISSMTPPORT = 25;
        public static string MAIL_USERNAME = "support@indiastatquiz.com";
        public static string MAIL_PASSWORD = "Quiz@2024#";

        public HomeController(IMemoryCache cache)
        {
            _cache = cache;
        }


        [Route("/Home/Examlogin/{ExamId}/{UPASSID}")]
        public IActionResult Directlogin()
        {


            //  string url = Request.Host.ToString();

         //   return   Redirect("/home/examlogin/" + ExamId);


            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");
            var PASSID = HttpContext.GetRouteValue("UPASSID");

            string url = Request.Host.ToString();
            host = "https://" + url + "/home/examlogin/"+ViewBag.ExamId+"/"+PASSID;

           

            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddHours(2);


            using (SqlConnection con = new SqlConnection(util.strElect))
            {
                using (SqlCommand cmd = new SqlCommand("select  name,USERID,isnull(totalnoofq,0) totalnoofq,ISNULL(DOMAIN_NAME,'')DOMAIN_NAME,isnull(address_user,'')address_user  from tblSOE_Users WITH (NOLOCK) where AdminId=@username ; SELECT * FROM  [tblEXDATE] where getdate() between EXAtime and endtime ", con))
                {
                    try
                    {
                        if (con.State == ConnectionState.Closed)
                            con.Open();
                        cmd.CommandType = CommandType.Text;
                       cmd.Parameters.AddWithValue("@username", PASSID);
                      //  cmd.Parameters.AddWithValue("@pwd", PASSID);
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        DataTable dt = new DataTable();
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            if (ds.Tables[0].Rows[0]["USERID"].ToString().ToLower() != "ajay@bsdinfotech.com")
                            {
                                if (host.ToLower() == ds.Tables[0].Rows[0]["DOMAIN_NAME"].ToString().ToLower())
                                {


                                    if (Convert.ToInt32(ds.Tables[0].Rows[0]["totalnoofq"].ToString()) > 0)
                                    {

                                        Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                        Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                        Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);

                                        return Redirect("/Home/score/" + ViewBag.ExamId);
                                        // message = "ra";
                                        // status = "S";


                                    }
                                    else
                                    {

                                        if (ds.Tables[1].Rows.Count > 0)
                                        {

                                            Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                            Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                            Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);

                                            return Redirect("/Home/Welcome/" + ViewBag.ExamId);
                                            // message = "ga";
                                            //status = "S";

                                        }
                                        else
                                        {

                                            return Redirect("/home/examlogin/" + ViewBag.ExamId);

                                            //
                                            //log.Add("na");
                                            //  message = "na";
                                            //status = "e";

                                        }
                                    }
                                }
                                else
                                {

                                    return Redirect(ds.Tables[0].Rows[0]["DOMAIN_NAME"].ToString());
                                    // message = "ur";
                                    // status = ds.Tables[0].Rows[0]["DOMAIN_NAME"].ToString();


                                }

                            }
                            else
                            {
                                Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);
                                return Redirect("/Home/Welcome/" + ViewBag.ExamId);

                                //message = "ga";
                                //status = "S";



                            }

                        }
                        else
                        {
                            cmd.Dispose();
                            return Redirect("/home/examlogin/" + ViewBag.ExamId);
                            //message = "inv";
                            //status = "e";
                            //log.Add("inv");
                        }
                    }
                    catch (SqlException odbcEx)
                    {

                      
                    }
                    finally
                    {
                        if (con.State == ConnectionState.Open)
                            con.Close();
                    }
                }
            }
        

            return View();
        }
        [Route("/Home/Examlogin/{ExamId}")]
        public IActionResult Examlogin()
        {

            string url = Request.Host.ToString();



            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");
            //ViewBag.useridS= HttpContext.GetRouteValue("userid");

           // ViewBag.host12 = "https://" + url + "/home/examlogin/" + ViewBag.ExamId + "/" + ViewBag.useridS + "";




            var userid = HttpContext.Request.Cookies["uid"];

            var unmae = HttpContext.Request.Cookies["uname"];
            return View();
        }
        [Route("/Home/score/{ExamId}")]
        public IActionResult score()
        {
            
            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");
            string ExamId = ViewBag.ExamId;
            var userid = HttpContext.Request.Cookies["uid"];
            string examsession = HttpContext.Request.Cookies["examsession"];

            var unmae = HttpContext.Request.Cookies["uname"];


            if (string.IsNullOrEmpty(userid))
            {

                return Redirect("/home/examlogin/"+ ExamId);

            }


            ViewBag.examsession = examsession;
            ViewBag.uid = userid;
            ViewBag.uname = unmae;




            return View();
        }

        [Route("/Home/certificate/{ExamId}")]
        public IActionResult certificate()
        {

            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");
            string ExamId = ViewBag.ExamId;
            var userid = HttpContext.Request.Cookies["uid"];

            var adddesss=  HttpContext.Request.Cookies["uadress"];
            var unmae = HttpContext.Request.Cookies["uname"];

            ViewBag.add = adddesss;

            if (string.IsNullOrEmpty(userid))
            {

                return Redirect("/home/examlogin/" + ExamId);

            }


            ViewBag.uid = userid;
            ViewBag.uname = unmae;




            return View();
        }


        [Route("/Home/Welcome/{ExamId}")]
        public IActionResult Welcome()
        {


            string ExamId = HttpContext.GetRouteValue("ExamId").ToString();
            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");
            var userid = HttpContext.Request.Cookies["uid"];
            var unmae = HttpContext.Request.Cookies["uname"];

            if (string.IsNullOrEmpty(userid))
            {

                return Redirect("/home/examlogin/" + ExamId);

            }
            return View();
        }

        [HttpPost]
        public IActionResult  fngetreport(string uid,string examid)
        {
            var scores = new List<string>();

            ViewBag.totalquest1 = 0;
          
                //string key = "reportdata_" + uid;

                //if (!_cache.TryGetValue(key, out DataTable reportData))
                //{


                    using (SqlConnection con = new SqlConnection(util.strElect))
                    {
                  
                    using (SqlCommand cmd = new SqlCommand("select title,name,totalnoofq,isnull(address_user,'') address1,CASE WHEN  isnull(attemptq,0) < 46 THEN isnull(attemptq,0)  ELSE 45 END AS attemptq, isnull(correctans,0)correctans,isnull(totalnoofq1,0)totalnoofq1,CASE WHEN isnull(attemptq1,0)  < 46 THEN isnull(attemptq1,0)  ELSE 45 END AS attemptq1, isnull(correctans1,0)correctans1  from tblSOE_Users WITH (NOLOCK)  where userid=@uid", con))
                    {
                            try
                            {
                               DataTable reportData = new DataTable();

                                cmd.Parameters.Add(new SqlParameter("@uid", SqlDbType.NVarChar, 300)).Value = uid;
                                if (con.State == ConnectionState.Closed)
                                    con.Open();
                                SqlDataAdapter da = new SqlDataAdapter(cmd);

                                da.Fill(reportData);
                                if (reportData.Rows.Count > 0)
                                {
                       //             var cacheEntryOptions = new MemoryCacheEntryOptions()
                       //.SetSlidingExpiration(TimeSpan.FromMinutes(15)); // or use SetAbsoluteExpiration

                       //             _cache.Set(key, reportData, cacheEntryOptions);

                                    // HttpContext.Current.Cache.Insert("reportdata_" + uid, dt, null, DateTime.Now.AddMinutes(12), System.Web.Caching.Cache.NoSlidingExpiration);

                                    scores.Add(reportData.Rows[0]["attemptq"].ToString());
                                    scores.Add(reportData.Rows[0]["correctans"].ToString());
                                    scores.Add(reportData.Rows[0]["name"].ToString());
                                    scores.Add(reportData.Rows[0]["totalnoofq"].ToString());
                                    scores.Add(reportData.Rows[0]["title"].ToString());
                                    scores.Add(reportData.Rows[0]["address1"].ToString());
                                   scores.Add(reportData.Rows[0]["attemptq1"].ToString());
                                   scores.Add(reportData.Rows[0]["correctans1"].ToString());
                           
                                    scores.Add(reportData.Rows[0]["totalnoofq1"].ToString());

                                  ViewBag.totalquest1 = reportData.Rows[0]["totalnoofq1"].ToString();
                                //ViewBag.hdfaddress = reportData.Rows[0]["address1"].ToString();

                            
                            }
                            }
                            catch (Exception ex)
                            {
                        con.Close();
                        
                          }
                            finally
                            {
                                con.Close();

                            }


                        }
                   }
                //}
                //else
                //{


                //    if (reportData.Rows.Count > 0)
                //    {

                //        scores.Add(reportData.Rows[0]["attemptq"].ToString());
                //        scores.Add(reportData.Rows[0]["correctans"].ToString());
                //        scores.Add(reportData.Rows[0]["name"].ToString());
                //        scores.Add(reportData.Rows[0]["totalnoofq"].ToString());
                //        scores.Add(reportData.Rows[0]["title"].ToString());
                //        scores.Add(reportData.Rows[0]["address1"].ToString());
                //    scores.Add(reportData.Rows[0]["attemptq1"].ToString());
                //    scores.Add(reportData.Rows[0]["correctans1"].ToString());

                //    scores.Add(reportData.Rows[0]["totalnoofq1"].ToString());

                //    ViewBag.totalquest1 = reportData.Rows[0]["totalnoofq1"].ToString();
                //}

               // }
                return Json(scores);
           

          

            // return scores.ToArray();
        }
        [Route("/Home/StartExam/{ExamId}")]
        public IActionResult StartExam()
        {
            
            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddHours(2);
            string session = DateTime.Now.Ticks.ToString();
            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");
            string ExamId = ViewBag.ExamId;

           // return Redirect("/home/examlogin/" + ExamId);

            var userid = HttpContext.Request.Cookies["uid"];

            var unmae = HttpContext.Request.Cookies["uname"];
            DataTable DT = new DataTable();
            DataTable DT1 = new DataTable();

            if (string.IsNullOrEmpty(userid))
            {

                return Redirect("/home/examlogin/" + ExamId);

            }
            using (SqlConnection con = new SqlConnection(util.strElect))
            {
                using (SqlCommand cmd = new SqlCommand("select  isnull(finalendexam,0)finalendexam,isnull(totalnoofq,0)totalnoofq from tblSOE_Users WITH (NOLOCK) where userid='" + userid + "'", con))
                {
                    try
                    {

                        if (con.State == ConnectionState.Closed)
                            con.Open();
                        SqlDataAdapter da1 = new SqlDataAdapter(cmd);

                        da1.Fill(DT1);

                        if (DT1.Rows.Count > 0)
                        {
                            if (DT1.Rows[0]["finalendexam"].ToString() == "1")
                            {
                                Response.Cookies.Append("examsession", session, option);
                                return Redirect("/home/score/"+ExamId);
                            }
                            if (Convert.ToInt32(DT1.Rows[0]["totalnoofq"].ToString()) > 0)
                            {
                                Response.Cookies.Append("examsession", session, option);
                                return Redirect("/home/score/"+ExamId);
                            }
                           // return Redirect("/home/examlogin/" + ExamId);
                        }
                        else
                        {
                            return Redirect("/home/examlogin/" + ExamId);
                        }
                    }
                    catch (Exception ex)
                    {
                        con.Close();
                    }
                    finally
                    {
                        con.Close();
                    }
                }
            }




            ViewBag.uid = userid;
            ViewBag.uname = unmae;
            ViewBag.BindLanguage = util.PopulateDropDownjson("exec Usp_exam_new_json @Action='BindLanuage',@ExamId='" + ExamId + "'", util.strElect);
            DataTable dt = new DataTable();
            
            Response.Cookies.Append("examsession", session, option);
            string query = $"update tblSOE_Users set EXAMSESSION='{session}' where userid='{userid}'";
            var result = util.ExecQuery(query, util.strElect);
            return View();
        }
        [Route("/Home/REStartExam/{ExamId}")]
        public IActionResult REStartExam()
        {
            string ExamId = HttpContext.GetRouteValue("ExamId").ToString();
            ViewBag.ExamId = HttpContext.GetRouteValue("ExamId");

         //   return Redirect("/home/examlogin/" + ExamId);

            var userid = HttpContext.Request.Cookies["uid"];

            var unmae = HttpContext.Request.Cookies["uname"];
            DataTable DT = new DataTable();
            DataTable DT1 = new DataTable();

            if (string.IsNullOrEmpty(userid))
            {

                return Redirect("/home/examlogin/" + ExamId);

            }

            using (SqlConnection con = new SqlConnection(util.strElect))
            {
                using (SqlCommand cmd = new SqlCommand("select  isnull(finalendexam1,0)finalendexam,totalnoofq1 from tblSOE_Users WITH (NOLOCK) where userid='" + userid + "'", con))
                {
                    try
                    {

                        if (con.State == ConnectionState.Closed)
                            con.Open();
                        SqlDataAdapter da1 = new SqlDataAdapter(cmd);

                        da1.Fill(DT1);

                        if (DT1.Rows.Count > 0)
                        {
                            if (DT1.Rows[0]["finalendexam"].ToString() == "1")
                            {
                                return Redirect("/home/score/" + ExamId);
                            }
                            if (Convert.ToInt32(DT1.Rows[0]["totalnoofq1"].ToString()) > 0)
                            {

                                return Redirect("/home/score/" + ExamId);
                            }
                        }
                        else
                        {
                            return Redirect("/home/examlogin/" + ExamId);
                        }
                    }
                    catch (Exception ex)
                    {
                        con.Close();
                    }
                    finally
                    {
                        con.Close();
                    }
                }
            }

            ViewBag.uid = userid;
            ViewBag.uname = unmae;
            ViewBag.BindLanguage = util.PopulateDropDownjson("exec Usp_exam_new_json @Action='BindLanuage',@ExamId='" + ExamId + "'", util.strElect);
            DataTable dt = new DataTable();

            return View();
        }
        #region OldCode
        [HttpPost]
        public JsonResult fnGetQuestionsonLang(string uid, int ExamId)
        {
            Random random = new Random();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {

                    using (SqlCommand cmd = new SqlCommand("EXEC Usp_exam_new 'Language','" + uid + "','" + ExamId + "'", con))
                    {
                        try
                        {
                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            SqlDataAdapter da = new SqlDataAdapter(cmd);
                            da.Fill(dt);
                            Dictionary<string, object> row;
                            foreach (DataRow dr in dt.Rows)
                            {
                                row = new Dictionary<string, object>();
                                foreach (DataColumn col in dt.Columns)
                                {
                                    row.Add(col.ColumnName, dr[col]);
                                }
                                rows.Add(row);
                            }
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            con.Close();
                        }

                        

                    }
                }
            }
            catch (Exception ex)
            {

                throw new Exception();
            }
            return Json(JsonConvert.SerializeObject(rows));
        }
        [HttpPost]
        public JsonResult fnGetQuestionsonLangRE(string uid, int ExamId)
        {
            Random random = new Random();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {

                    using (SqlCommand cmd = new SqlCommand("EXEC Usp_exam_new_RE 'Language','" + uid + "','" + ExamId + "'", con))
                    {
                        try
                        {
                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            SqlDataAdapter da = new SqlDataAdapter(cmd);
                            da.Fill(dt);


                            Dictionary<string, object> row;
                            foreach (DataRow dr in dt.Rows)
                            {
                                row = new Dictionary<string, object>();
                                foreach (DataColumn col in dt.Columns)
                                {
                                    row.Add(col.ColumnName, dr[col]);
                                }
                                rows.Add(row);
                            }
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            con.Close();
                        }

                        //return serializer.Serialize(rows);

                    }
                }
            }
            catch (Exception ex)
            {

                throw new Exception();
            }
            return Json(JsonConvert.SerializeObject(rows));
        }

        [HttpPost]
        public JsonResult fngetquestions(string uid, int ExamId, int LangId)
        {
            Random random = new Random();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {

                    using (SqlCommand cmd = new SqlCommand("EXEC Usp_exam_new 'getquestions','" + uid + "','" + ExamId + "','" + LangId + "'", con))
                    {
                        try
                        {
                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            SqlDataAdapter da = new SqlDataAdapter(cmd);
                            da.Fill(dt);


                            Dictionary<string, object> row;
                            foreach (DataRow dr in dt.Rows)
                            {
                                row = new Dictionary<string, object>();
                                foreach (DataColumn col in dt.Columns)
                                {
                                    row.Add(col.ColumnName, dr[col]);
                                }
                                rows.Add(row);
                            }
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            con.Close();
                        }

                        //return serializer.Serialize(rows);

                    }
                }
            }
            catch (Exception ex)
            {
              
                throw new Exception();
            }
            return Json(JsonConvert.SerializeObject(rows));
        }


        [HttpPost]
        public JsonResult fngetquestionsRE(string uid, int ExamId, int LangId)
        {
            Random random = new Random();
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            try
            {
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {

                    using (SqlCommand cmd = new SqlCommand("EXEC Usp_exam_new_RE 'getquestions','" + uid + "','" + ExamId + "','" + LangId + "'", con))
                    {
                        try
                        {
                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            SqlDataAdapter da = new SqlDataAdapter(cmd);
                            da.Fill(dt);


                            Dictionary<string, object> row;
                            foreach (DataRow dr in dt.Rows)
                            {
                                row = new Dictionary<string, object>();
                                foreach (DataColumn col in dt.Columns)
                                {
                                    row.Add(col.ColumnName, dr[col]);
                                }
                                rows.Add(row);
                            }
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            con.Close();
                        }

                        //return serializer.Serialize(rows);

                    }
                }
            }
            catch (Exception ex)
            {

                throw new Exception();
            }
            return Json(JsonConvert.SerializeObject(rows));
        }

        #endregion
        public IActionResult recaptchamatch(UserLogin user, string uname, int password, string examid, int langid, string Captcha)
        {
            dynamic captchaHash = HttpContext.Session.GetString("Captcha");
            var captchastring = HttpContext.Session.GetString("captchaString");
            if (captchaHash == Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(user.Captcha.ToUpper()))))
            {
                string query = $"insert into UserCaptcha(Captcha,CaptchaString,UserId,Flag,AttemptFlg)values('{Captcha}','{captchastring}','{uname}',{langid},{password})";
                var result = util.ExecQuery(query, util.strElect);
                return Json(new { message = "Captcha matched", status = "Success" });
            }
            else
            {
                return Json(new { message = "Captcha not matched", status = "Error" });
            }
        }

        #region OldCode
        [HttpPost]
        public IActionResult fnwbloginuser(UserLogin user, string uname, string password, string examid, string langid,string Captcha)
        {
            //string usersession
            string message = "", status = "";
            var log = new List<string>();

            string url = Request.Host.ToString();
            host = "https://"+url+"/home/examlogin/"+examid+"";
            dynamic captchaHash = HttpContext.Session.GetString("Captcha");
            if (captchaHash == Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(user.Captcha.ToUpper()))))
            {

             
                CookieOptions option = new CookieOptions();
                option.Expires = DateTime.Now.AddHours(2);
                using (SqlConnection con = new SqlConnection(util.strElect))
             {
                using (SqlCommand cmd = new SqlCommand("select  name,USERID,isnull(totalnoofq,0) totalnoofq,ISNULL(DOMAIN_NAME,'')DOMAIN_NAME,isnull(address_user,'')address_user  from tblSOE_Users WITH (NOLOCK) where userid=@username and password=@pwd ; SELECT * FROM  [tblEXDATE] where getdate() between EXAtime and endtime ", con))
                {
                    try
                    {
                            Response.Cookies.Append("examsession", "0987654322", option);

                            if (con.State == ConnectionState.Closed)
                            con.Open();
                        cmd.CommandType = CommandType.Text;
                        cmd.Parameters.AddWithValue("@username", user.uname);
                        cmd.Parameters.AddWithValue("@pwd", user.password);
                        SqlDataAdapter da = new SqlDataAdapter(cmd);
                        DataTable dt = new DataTable();
                        DataSet ds = new DataSet();
                        da.Fill(ds);

                        if (ds.Tables[0].Rows.Count > 0)
                        {
                                if (ds.Tables[0].Rows[0]["USERID"].ToString() != "ajay@bsdinfotech.com")
                                {
                                    if (host.ToLower() == ds.Tables[0].Rows[0]["DOMAIN_NAME"].ToString().ToLower())
                                {
                                   

                                        if (Convert.ToInt32(ds.Tables[0].Rows[0]["totalnoofq"].ToString()) > 0)
                                        {

                                            Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                            Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                            Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);


                                            message = "ra";
                                            status = "S";


                                        }
                                        else
                                        {

                                            if (ds.Tables[1].Rows.Count > 0)
                                            {

                                                Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                                Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                                Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);
                                                message = "ga";
                                                status = "S";

                                            }
                                            else
                                            {

                                                //
                                                //log.Add("na");
                                                message = "na";
                                                status = "e";

                                            }
                                        }
                                    }
                                    else
                                    {

                                        //Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                        //Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                        //Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);
                                        //message = "ga";
                                        //status = "S";
                                        message = "ur";
                                        status = ds.Tables[0].Rows[0]["DOMAIN_NAME"].ToString();


                                    }

                                }
                                else
                                {
                                    Response.Cookies.Append("uname", ds.Tables[0].Rows[0]["name"].ToString(), option);
                                    Response.Cookies.Append("uid", ds.Tables[0].Rows[0]["userid"].ToString(), option);
                                    Response.Cookies.Append("uadress", ds.Tables[0].Rows[0]["address_user"].ToString(), option);

                                    message = "ga";
                                    status = "S";

                                   

                                }

                        }
                        else
                        {
                            cmd.Dispose();
                            message = "inv";
                            status = "e";
                            //log.Add("inv");
                        }
                    }
                    catch (SqlException odbcEx)
                    {

                        message = "er";
                        status = "e";
                        //log.Add("er");
                    }
                    finally
                    {
                        if (con.State == ConnectionState.Open)
                            con.Close();
                    }
                }
            }
            }
            else
            {
                message = "cc";
                status = "Error";
            }

            var Data = new { message = message, status = status };
            var data = JsonConvert.SerializeObject(Data);
            return Content(data, "application/json");
            //return Json(JsonConvert.SerializeObject(log));
        }
        public class UserLogin
        {

            public string uname { get; set; }

            public string password { get; set; }

            public string examid { get; set; }
            public string langid { get; set; }
            public string Captcha { get; set; }


        }

        public static string fnReset()
        {
            //string constr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["CSWAllSubmits"].ConnectionString;
            //DataTable dt = new DataTable();
            //using (SqlConnection con = new SqlConnection(constr))
            //{
            //    using (SqlCommand cmd = new SqlCommand("update tblSOE_Users_jh set flag=1 where userid='" + HttpContext.Current.Session["uid"].ToString() + "'", con))
            //    {
            //        if (con.State == ConnectionState.Closed)
            //            con.Open();
            //        int execnum = cmd.ExecuteNonQuery();
            //        con.Close();
            //        if (execnum > 0)
            //            return "ok";
            //        else
            //            throw new Exception();
            //    }
            //}
            //HttpContext.Current.Session["Refresh"] = "Press";
            return "ok";
        }

        
        public JsonResult fncheckans(string rzs, string gzs, string uid)
        {
            try
            {
                //string constr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["CSWAllSubmits"].ConnectionString;
                DataTable dt = new DataTable();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {
                    int totalAttempt = 0, correctAns = 0;
                    using (SqlCommand cmd = new SqlCommand("select attemptq, correctans from tblSOE_Users_jh where userid=@uid", con))
                    {
                        cmd.Parameters.Add(new SqlParameter("@uid", SqlDbType.NVarChar, 300)).Value = uid;
                        if (con.State == ConnectionState.Closed)
                            con.Open();
                        SqlDataReader sdrQ = cmd.ExecuteReader();
                        if (sdrQ.HasRows)
                        {
                            while (sdrQ.Read())
                            {
                                totalAttempt = Convert.ToInt32((String.IsNullOrEmpty(sdrQ["attemptq"].ToString()) ? "0" : sdrQ["attemptq"])) + Convert.ToInt32(rzs);
                                correctAns = Convert.ToInt32((String.IsNullOrEmpty(sdrQ["correctans"].ToString()) ? "0" : sdrQ["correctans"])) + Convert.ToInt32(gzs);
                            }
                        }
                        con.Close();
                    }
                    using (SqlCommand cmd = new SqlCommand("update tblSOE_Users_jh set attemptq=" + totalAttempt + ", correctans=" + correctAns + ",EXAMSOUTTIME=GETDATE() where userid=@uid", con))
                    {
                        cmd.Parameters.Add(new SqlParameter("@uid", SqlDbType.NVarChar, 300)).Value = uid;
                        if (con.State == ConnectionState.Closed)
                            con.Open();
                        int execnum = cmd.ExecuteNonQuery();
                        con.Close();
                        if (execnum > 0)
                            return Json("");
                        else
                            throw new Exception();
                    }
                }
            }
            catch (Exception ex) { throw new Exception(); }
        }

        [HttpPost]
        public JsonResult fnoptionsubmitans(string rzs, string gzs, string uid, int QnsId, string OptId, string rightans)
        {
            //string constr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["CSWAllSubmits"].ConnectionString;
            DataTable dt = new DataTable();
            var scores = new List<string>();
            try
            {
                int execnum = 0;
                int totalAttempt = 0, correctAns = 0; string uname = "", email = "";
                totalAttempt = Convert.ToInt32(rzs);
                correctAns = Convert.ToInt32(gzs);
                uid = JsonConvert.DeserializeObject(uid).ToString();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {
                    using (SqlCommand cmd = new SqlCommand(" update tblSOE_Users_all_exam set OPTION_name='" + OptId.ToString().Replace("'", "''") + "',Right_ans=N'" + rightans + "' where userid='" + uid + "' and QUESTION_ID='" + QnsId + "'; update tblSOE_Users set attemptq=" + totalAttempt + ", correctans=" + correctAns + ",EXAMSOUTTIME=GETDATE() where userid='" + uid + "'", con))
                    {
                        try
                        {

                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            execnum = cmd.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            if (con.State == ConnectionState.Open)
                                con.Close();
                        }
                    }
                    if (execnum > 0)
                    {

                        return Json("ok");
                    }
                    else
                    {
                        throw new Exception();
                    }

                    


                }
            }
            catch (Exception ex) { throw new Exception(); }

        }
        [HttpPost]
        public JsonResult fnoptionsubmitansRE(string rzs, string gzs, string uid, int QnsId, string OptId, string rightans)
        {
            //string constr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["CSWAllSubmits"].ConnectionString;
            DataTable dt = new DataTable();
            var scores = new List<string>();
            try
            {
                int execnum = 0;
                int totalAttempt = 0, correctAns = 0; string uname = "", email = "";
                totalAttempt = Convert.ToInt32(rzs);
                correctAns = Convert.ToInt32(gzs);
                uid = JsonConvert.DeserializeObject(uid).ToString();
                using (SqlConnection con = new SqlConnection(util.strElect))
                {
                    using (SqlCommand cmd = new SqlCommand(" update tblSOE_Users_all_exam_RE set OPTION_name='" + OptId.ToString().Replace("'", "''") + "',Right_ans=N'" + rightans + "' where userid='" + uid + "' and QUESTION_ID='" + QnsId + "'; update tblSOE_Users set attemptq1=" + totalAttempt + ", correctans1=" + correctAns + ",EXAMSOUTTIME1=GETDATE() where userid='" + uid + "'", con))
                    {
                        try
                        {

                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            execnum = cmd.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            if (con.State == ConnectionState.Open)
                                con.Close();
                        }
                    }
                    if (execnum > 0)
                    {

                        return Json("ok");
                    }
                    else
                    {
                        throw new Exception();
                    }




                }
            }
            catch (Exception ex) { throw new Exception(); }

        }
        [HttpPost]
        public JsonResult fnsubmitans(string rzs, string gzs, string uid)
        {
            //string constr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["CSWAllSubmits"].ConnectionString;
            DataTable dt = new DataTable();
            var scores = new List<string>();
            try
            {
                using (SqlConnection con = new SqlConnection(util.strElect))
                {

                    int totalAttempt = 0, correctAns = 0; string uname = "", email = "";
                    totalAttempt = Convert.ToInt32(rzs);
                    correctAns = Convert.ToInt32(gzs);
                  
                    int execnum = 0;
                    using (SqlCommand cmd = new SqlCommand("update tblSOE_Users set attemptq=" + totalAttempt + ", correctans=" + correctAns + ",EXAMSOUTTIME=GETDATE(),finalendexam=1 where userid=@uid", con))
                    {
                        cmd.Parameters.Add(new SqlParameter("@uid", SqlDbType.NVarChar, 300)).Value = uid;
                        try
                        {
                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            execnum = cmd.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            con.Close();
                        }
                    }
                    if (execnum > 0)
                    {

                        //string rmsg = SendMailViaIIS_html("", email, "", "none", "Thank you - 2nd International Equanimity Olympiad-2016", "", sbody.ToString());
                        return Json("ok");
                    }
                    else
                    {
                        throw new Exception();
                    }

                }
            }
            catch (Exception ex) { throw new Exception(); }

        }
        [HttpPost]
        public JsonResult fnsubmitansRE(string rzs, string gzs, string uid)
        {
            //string constr = System.Web.Configuration.WebConfigurationManager.ConnectionStrings["CSWAllSubmits"].ConnectionString;
            DataTable dt = new DataTable();
            var scores = new List<string>();
            try
            {
                using (SqlConnection con = new SqlConnection(util.strElect))
                {

                    int totalAttempt = 0, correctAns = 0; string uname = "", email = "";
                    totalAttempt = Convert.ToInt32(rzs);
                    correctAns = Convert.ToInt32(gzs);
                  
                    int execnum = 0;
                    using (SqlCommand cmd = new SqlCommand("update tblSOE_Users set attemptq1=" + totalAttempt + ", correctans1=" + correctAns + ",EXAMSOUTTIME1=GETDATE(),finalendexam1=1 where userid=@uid", con))
                    {
                        cmd.Parameters.Add(new SqlParameter("@uid", SqlDbType.NVarChar, 300)).Value = uid;
                        try
                        {
                            if (con.State == ConnectionState.Closed)
                                con.Open();
                            execnum = cmd.ExecuteNonQuery();
                        }
                        catch (Exception ex)
                        {

                        }
                        finally
                        {
                            con.Close();
                        }
                    }
                    if (execnum > 0)
                    {

                        //string rmsg = SendMailViaIIS_html("", email, "", "none", "Thank you - 2nd International Equanimity Olympiad-2016", "", sbody.ToString());
                        return Json("ok");
                    }
                    else
                    {
                        throw new Exception();
                    }

                }
            }
            catch (Exception ex) { throw new Exception(); }

        }
        public static string SendMailViaIIS_html(string _from, string _to, string _cc, string _bcc, string _subject, string _attach, string _body)
        {
            //create the mail message
            string functionReturnValue = null;
            try
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();

                //set the addresses
                if (_from.Trim().Length == 0)
                {
                    _from = "support@indiastatelections.com";
                    //_from = """Support Team"" support@indiastat.com"
                }
                mail.From = new System.Net.Mail.MailAddress(_from);

                if (_to.Trim().Length > 0)
                {
                    mail.To.Add(new System.Net.Mail.MailAddress(_to));
                }
                // mail.Attachments.Add(new System.Net.Mail.Attachment(ms, "Certificate.png"));
                mail.Subject = _subject;
                mail.Body = _body;
                mail.IsBodyHtml = true;

                System.Net.Mail.SmtpClient SmtpClient = new System.Net.Mail.SmtpClient();

                SmtpClient.Host = "smtp.adfactorspr.com";

                SmtpClient.Credentials = new System.Net.NetworkCredential("support@indiastatelections.com", "P@ssw0rd%");

                SmtpClient.Port = 25;
                SmtpClient.Send(mail);
                functionReturnValue = "Sent";
                mail.Dispose();
                SmtpClient = null;
            }
            catch (System.FormatException ex)
            {
                functionReturnValue = ex.Message;
            }
            catch (System.Net.Mail.SmtpException ex)
            {
                functionReturnValue = ex.Message;

            }
            catch (System.Exception ex)
            {
                functionReturnValue = ex.Message;
            }
            return functionReturnValue;

        }
        #endregion
        #region Captcha
        public IActionResult GetCaptchaL()
{
    const int width = 220;
    const int height = 50;
    const string fontFamily = "Tahoma";

    var random = new Random();
    int num1 = random.Next(1, 50);
    int num2 = random.Next(1, 50);
    int num3 = random.Next(1, 50);

    string captchaString = $"Lowest: {num1}, {num2}, {num3}";
    int lowest = Math.Min(num1, Math.Min(num2, num3));

    var captchaHash = Convert.ToBase64String(
        System.Security.Cryptography.MD5.Create()
        .ComputeHash(System.Text.Encoding.UTF8.GetBytes(lowest.ToString()))
    );

    HttpContext.Session.SetString("captchaString", captchaString);
    HttpContext.Session.SetString("Captcha", captchaHash);

    using var bitmap = new System.Drawing.Bitmap(width, height);
    using var g = System.Drawing.Graphics.FromImage(bitmap);
    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

    // Clear background (plain white)
    g.Clear(System.Drawing.Color.White);

    // Find appropriate font size
    float fontSize = height;
    System.Drawing.Font font;
    do
    {
        fontSize -= 1;
        font = new System.Drawing.Font(fontFamily, fontSize, System.Drawing.FontStyle.Bold);
    } while (g.MeasureString(captchaString, font).Width > width);

    using var textBrush = new System.Drawing.Drawing2D.HatchBrush(
        System.Drawing.Drawing2D.HatchStyle.ZigZag,
        System.Drawing.Color.DarkBlue,
        System.Drawing.Color.Black
    );

    using var path = new System.Drawing.Drawing2D.GraphicsPath();
    path.AddString(captchaString, font.FontFamily, (int)font.Style, font.Size, new System.Drawing.Rectangle(0, 0, width, height), new System.Drawing.StringFormat
    {
        Alignment = System.Drawing.StringAlignment.Center,
        LineAlignment = System.Drawing.StringAlignment.Center
    });

    var warpPoints = new System.Drawing.PointF[4]
    {
        new(random.Next(width) / 4f, random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, random.Next(height) / 4f),
        new(random.Next(width) / 4f, height - random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, height - random.Next(height) / 4f)
    };

    using var matrix = new System.Drawing.Drawing2D.Matrix();
    path.Warp(warpPoints, new System.Drawing.Rectangle(0, 0, width, height), matrix, System.Drawing.Drawing2D.WarpMode.Perspective, 0);
    g.FillPath(textBrush, path);

    // Optional: Add minimal noise
    int noiseCount = width * height / 100; // reduced noise
    /*for (int i = 0; i < noiseCount; i++)
    {
        int x = random.Next(width);
        int y = random.Next(height);
        int w = random.Next(2);
        int h = random.Next(2);
        g.FillEllipse(textBrush, x, y, w, h);
    }*/

    using var stream = new System.IO.MemoryStream();
    bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Png); // PNG supports transparency
    var base64Image = Convert.ToBase64String(stream.ToArray());

    return Json(new { base64Image });
}

   

        public IActionResult GetCaptchaH()
        {
            // CAPTCHA configuration
            const int width = 220;
            const int height = 50;
            const string fontFamily = "Tahoma";

            // Generate three random numbers
            var random = new Random();
            int num1 = random.Next(1, 50);
            int num2 = random.Next(1, 50);
            int num3 = random.Next(1, 50);

            // Question: "Highest: 12 7 5"
            string captchaString = $"Highest: {num1}, {num2}, {num3}";

            // Store the highest number in session
            int highest = Math.Max(num1, Math.Max(num2, num3));

            var captchaHash = Convert.ToBase64String(
                System.Security.Cryptography.MD5.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(highest.ToString()))
            );
            HttpContext.Session.SetString("captchaString", captchaString.ToString());
            HttpContext.Session.SetString("Captcha", captchaHash.ToString());

            // Create bitmap and graphics
            using var bitmap = new System.Drawing.Bitmap(width, height);
            using var g = System.Drawing.Graphics.FromImage(bitmap);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            // Draw background
            var rect = new System.Drawing.Rectangle(0, 0, width, height);
            using var backgroundBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White);
            g.FillRectangle(backgroundBrush, rect);

            // Option 2: Or simpler, just clear the graphics with white
            g.Clear(System.Drawing.Color.White);

            // Find appropriate font size
            float fontSize = height;
            System.Drawing.Font font;
            do
            {
                fontSize -= 1;
                font = new System.Drawing.Font(fontFamily, fontSize, System.Drawing.FontStyle.Bold);
            } while (g.MeasureString(captchaString, font).Width > width);

            // Draw text with random warping
            using var textBrush = new System.Drawing.Drawing2D.HatchBrush(
                System.Drawing.Drawing2D.HatchStyle.ZigZag,
                System.Drawing.Color.DarkBlue,
                System.Drawing.Color.Black
            );
            using var path = new System.Drawing.Drawing2D.GraphicsPath();
            path.AddString(captchaString, font.FontFamily, (int)font.Style, font.Size, rect, new System.Drawing.StringFormat
            {
                Alignment = System.Drawing.StringAlignment.Center,
                LineAlignment = System.Drawing.StringAlignment.Center
            });

            var warpPoints = new System.Drawing.PointF[4]
            {
        new(random.Next(width) / 4f, random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, random.Next(height) / 4f),
        new(random.Next(width) / 4f, height - random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, height - random.Next(height) / 4f)
            };

            using var matrix = new System.Drawing.Drawing2D.Matrix();
            path.Warp(warpPoints, rect, matrix, System.Drawing.Drawing2D.WarpMode.Perspective, 0);
            g.FillPath(textBrush, path);

            // Add noise
           /* int noiseCount = width * height / 20;
            for (int i = 0; i < noiseCount; i++)
            {
                int x = random.Next(width);
                int y = random.Next(height);
                int w = random.Next(4);
                int h = random.Next(4);
                g.FillEllipse(textBrush, x, y, w, h);
            }*/

            // Convert bitmap to base64 string
            using var stream = new System.IO.MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            var base64Image = Convert.ToBase64String(stream.ToArray());

            // Return as JSON
            return Json(new { base64Image });
        }

        public IActionResult GetCaptchaDate()
        {
            // CAPTCHA configuration
            const int width = 200;
            const int height = 50;
            const string fontFamily = "Tahoma";

            // Get today's date in dd-MM-yyyy format
            string captchaString = DateTime.Now.ToString("dd-MM-yyyy");

            var captchaHash = Convert.ToBase64String(
               System.Security.Cryptography.MD5.Create()
               .ComputeHash(System.Text.Encoding.UTF8.GetBytes(captchaString.ToString()))
           );

            // Save date in session for validation
            HttpContext.Session.SetString("captchaString", captchaString);
            HttpContext.Session.SetString("Captcha", captchaHash);

            // Create bitmap and graphics
            using var bitmap = new System.Drawing.Bitmap(width, height);
            using var g = System.Drawing.Graphics.FromImage(bitmap);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            // Draw background
            var rect = new System.Drawing.Rectangle(0, 0, width, height);
            using var backgroundBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White);
            g.FillRectangle(backgroundBrush, rect);

            // Option 2: Or simpler, just clear the graphics with white
            g.Clear(System.Drawing.Color.White);

            // Find appropriate font size
            float fontSize = height;
            System.Drawing.Font font;
            do
            {
                fontSize -= 1;
                font = new System.Drawing.Font(fontFamily, fontSize, System.Drawing.FontStyle.Bold);
            } while (g.MeasureString(captchaString, font).Width > width);

            // Draw text with random warping
            using var textBrush = new System.Drawing.Drawing2D.HatchBrush(
                System.Drawing.Drawing2D.HatchStyle.ZigZag,
                System.Drawing.Color.DarkBlue,
                System.Drawing.Color.Black
            );
            using var path = new System.Drawing.Drawing2D.GraphicsPath();
            path.AddString(captchaString, font.FontFamily, (int)font.Style, font.Size, rect, new System.Drawing.StringFormat
            {
                Alignment = System.Drawing.StringAlignment.Center,
                LineAlignment = System.Drawing.StringAlignment.Center
            });

            var random = new Random();
            var warpPoints = new System.Drawing.PointF[4]
            {
        new(random.Next(width) / 4f, random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, random.Next(height) / 4f),
        new(random.Next(width) / 4f, height - random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, height - random.Next(height) / 4f)
            };

            using var matrix = new System.Drawing.Drawing2D.Matrix();
            path.Warp(warpPoints, rect, matrix, System.Drawing.Drawing2D.WarpMode.Perspective, 0);
            g.FillPath(textBrush, path);

            // Add noise
          /*  int noiseCount = width * height / 20;
            for (int i = 0; i < noiseCount; i++)
            {
                int x = random.Next(width);
                int y = random.Next(height);
                int w = random.Next(4);
                int h = random.Next(4);
                g.FillEllipse(textBrush, x, y, w, h);
            }*/

            // Convert bitmap to base64 string
            using var stream = new System.IO.MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            var base64Image = Convert.ToBase64String(stream.ToArray());

            // Return as JSON
            return Json(new { base64Image });
        }

        



        public IActionResult GetCaptchaCalp()
        {
            // CAPTCHA configuration
            const int width = 200;
            const int height = 50;
            const string fontFamily = "Tahoma";

            // Generate two random numbers for the calculation
            var random = new Random();
            int num1 = random.Next(1, 20);
            int num2 = random.Next(1, 20);

            // Create math question like "12 + 7 = ?"
            string captchaString = $"{num1} + {num2} = ?";

            // Save the correct answer in session
            int answer = num1 + num2;

            var captchaHash = Convert.ToBase64String(
                System.Security.Cryptography.MD5.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(answer.ToString()))
            );
            HttpContext.Session.SetString("captchaString", captchaString.ToString());
            HttpContext.Session.SetString("Captcha", captchaHash.ToString());

            // Create bitmap and graphics
            using var bitmap = new System.Drawing.Bitmap(width, height);
            using var g = System.Drawing.Graphics.FromImage(bitmap);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            // Draw background
            var rect = new System.Drawing.Rectangle(0, 0, width, height);
            using var backgroundBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White);
            g.FillRectangle(backgroundBrush, rect);

            // Option 2: Or simpler, just clear the graphics with white
            g.Clear(System.Drawing.Color.White);

            // Find appropriate font size
            float fontSize = height;
            System.Drawing.Font font;
            do
            {
                fontSize -= 1;
                font = new System.Drawing.Font(fontFamily, fontSize, System.Drawing.FontStyle.Bold);
            } while (g.MeasureString(captchaString, font).Width > width);

            // Draw text with random warping
            using var textBrush = new System.Drawing.Drawing2D.HatchBrush(
                System.Drawing.Drawing2D.HatchStyle.DashedUpwardDiagonal,
                System.Drawing.Color.DarkBlue,
                System.Drawing.Color.Black
            );
            using var path = new System.Drawing.Drawing2D.GraphicsPath();
            path.AddString(captchaString, font.FontFamily, (int)font.Style, font.Size, rect, new System.Drawing.StringFormat
            {
                Alignment = System.Drawing.StringAlignment.Center,
                LineAlignment = System.Drawing.StringAlignment.Center
            });

            var warpPoints = new System.Drawing.PointF[4]
            {
        new(random.Next(width) / 4f, random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, random.Next(height) / 4f),
        new(random.Next(width) / 4f, height - random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, height - random.Next(height) / 4f)
            };

            using var matrix = new System.Drawing.Drawing2D.Matrix();
            path.Warp(warpPoints, rect, matrix, System.Drawing.Drawing2D.WarpMode.Perspective, 0);
            g.FillPath(textBrush, path);

            // Add noise
         /*   int noiseCount = width * height / 20;
            for (int i = 0; i < noiseCount; i++)
            {
                int x = random.Next(width);
                int y = random.Next(height);
                int w = random.Next(4);
                int h = random.Next(4);
                g.FillEllipse(textBrush, x, y, w, h);
            }*/

            // Convert bitmap to base64 string
            using var stream = new System.IO.MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            var base64Image = Convert.ToBase64String(stream.ToArray());

            // Return as JSON
            return Json(new { base64Image });
        }




        public IActionResult GetCaptchaCalm()
        {
            // CAPTCHA configuration
            const int width = 200;
            const int height = 50;
            const string fontFamily = "Tahoma";

            // Generate two random numbers for the calculation
            var random = new Random();
            int num1 = random.Next(1, 20);
            int num2 = random.Next(1, 20);

            // Create math question like "12 + 7 = ?"
            string captchaString = $"{num1} - {num2} = ?";

            // Save the correct answer in session
            int answer = num1 - num2;

            var captchaHash = Convert.ToBase64String(
                System.Security.Cryptography.MD5.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(answer.ToString()))
            );
            HttpContext.Session.SetString("captchaString", captchaString.ToString());
            HttpContext.Session.SetString("Captcha", captchaHash.ToString());

            // Create bitmap and graphics
            using var bitmap = new System.Drawing.Bitmap(width, height);
            using var g = System.Drawing.Graphics.FromImage(bitmap);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            // Draw background
            var rect = new System.Drawing.Rectangle(0, 0, width, height);
            using var backgroundBrush = new System.Drawing.SolidBrush(System.Drawing.Color.White);
            g.FillRectangle(backgroundBrush, rect);

            // Option 2: Or simpler, just clear the graphics with white
            g.Clear(System.Drawing.Color.White);

            // Find appropriate font size
            float fontSize = height;
            System.Drawing.Font font;
            do
            {
                fontSize -= 1;
                font = new System.Drawing.Font(fontFamily, fontSize, System.Drawing.FontStyle.Bold);
            } while (g.MeasureString(captchaString, font).Width > width);

            // Draw text with random warping
            using var textBrush = new System.Drawing.Drawing2D.HatchBrush(
                System.Drawing.Drawing2D.HatchStyle.DashedUpwardDiagonal,
                System.Drawing.Color.DarkBlue,
                System.Drawing.Color.Black
            );
            using var path = new System.Drawing.Drawing2D.GraphicsPath();
            path.AddString(captchaString, font.FontFamily, (int)font.Style, font.Size, rect, new System.Drawing.StringFormat
            {
                Alignment = System.Drawing.StringAlignment.Center,
                LineAlignment = System.Drawing.StringAlignment.Center
            });

            var warpPoints = new System.Drawing.PointF[4]
            {
        new(random.Next(width) / 4f, random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, random.Next(height) / 4f),
        new(random.Next(width) / 4f, height - random.Next(height) / 4f),
        new(width - random.Next(width) / 4f, height - random.Next(height) / 4f)
            };

            using var matrix = new System.Drawing.Drawing2D.Matrix();
            path.Warp(warpPoints, rect, matrix, System.Drawing.Drawing2D.WarpMode.Perspective, 0);
            g.FillPath(textBrush, path);

            // Add noise
          /*  int noiseCount = width * height / 20;
            for (int i = 0; i < noiseCount; i++)
            {
                int x = random.Next(width);
                int y = random.Next(height);
                int w = random.Next(4);
                int h = random.Next(4);
                g.FillEllipse(textBrush, x, y, w, h);
            }
          */

            // Convert bitmap to base64 string
            using var stream = new System.IO.MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            var base64Image = Convert.ToBase64String(stream.ToArray());

            // Return as JSON
            return Json(new { base64Image });
        }




        public IActionResult GetCaptcha()
        {
            // CAPTCHA configuration
            const int width = 150;
            const int height = 30;
            const int captchaLength = 5;
            const string fontFamily = "Tahoma";

            // Generate random CAPTCHA string
            var random = new Random();
            var captchaString = new string(Enumerable.Range(0, captchaLength)
                .Select(_ => (char)random.Next('0', '9' + 1)).ToArray());

            // Save hashed CAPTCHA to session
            var captchaHash = Convert.ToBase64String(
                System.Security.Cryptography.MD5.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(captchaString))
            );
            HttpContext.Session.SetString("captchaString", captchaString);
            HttpContext.Session.SetString("Captcha", captchaHash);

            // Create bitmap and graphics
            using var bitmap = new System.Drawing.Bitmap(width, height);
            using var g = System.Drawing.Graphics.FromImage(bitmap);
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;

            // Draw background
            var rect = new System.Drawing.Rectangle(0, 0, width, height);
            using var backgroundBrush = new System.Drawing.Drawing2D.HatchBrush(
                System.Drawing.Drawing2D.HatchStyle.Vertical,
                System.Drawing.Color.LightGray,
                System.Drawing.Color.White
            );
            g.FillRectangle(backgroundBrush, rect);

            // Find appropriate font size
            float fontSize = height;
            System.Drawing.Font font;
            do
            {
                fontSize -= 1;
                font = new System.Drawing.Font(fontFamily, fontSize, System.Drawing.FontStyle.Bold);
            } while (g.MeasureString(captchaString, font).Width > width);

            // Draw text with random warping
            using var textBrush = new System.Drawing.Drawing2D.HatchBrush(
                System.Drawing.Drawing2D.HatchStyle.DashedUpwardDiagonal,
                System.Drawing.Color.DarkGray,
                System.Drawing.Color.Black
            );
            using var path = new System.Drawing.Drawing2D.GraphicsPath();
            path.AddString(captchaString, font.FontFamily, (int)font.Style, font.Size, rect, new System.Drawing.StringFormat
            {
                Alignment = System.Drawing.StringAlignment.Center,
                LineAlignment = System.Drawing.StringAlignment.Center
            });

            var warpPoints = new System.Drawing.PointF[4]
            {
        new (random.Next(width) / 4f, random.Next(height) / 4f),
        new (width - random.Next(width) / 4f, random.Next(height) / 4f),
        new (random.Next(width) / 4f, height - random.Next(height) / 4f),
        new (width - random.Next(width) / 4f, height - random.Next(height) / 4f)
            };

            using var matrix = new System.Drawing.Drawing2D.Matrix();
            path.Warp(warpPoints, rect, matrix, System.Drawing.Drawing2D.WarpMode.Perspective, 0);
            g.FillPath(textBrush, path);

            // Add noise
            int noiseCount = width * height / 20;
            for (int i = 0; i < noiseCount; i++)
            {
                int x = random.Next(width);
                int y = random.Next(height);
                int w = random.Next(4);
                int h = random.Next(4);
                g.FillEllipse(textBrush, x, y, w, h);
            }

            // Convert bitmap to base64 string
            using var stream = new System.IO.MemoryStream();
            bitmap.Save(stream, System.Drawing.Imaging.ImageFormat.Jpeg);
            var base64Image = Convert.ToBase64String(stream.ToArray());

            // Return as JSON
            return Json(new { base64Image });
        }
        #endregion
        [HttpPost]
        public IActionResult feedback( string Name, string Email, string Query)
        {

            try
            { 
            string id = "";
            int execnon = 0;
            string message = "", status = "";
            string Subject = "indiastat quiz : Ramcharitmanas Quiz – 2025 -feedback";
            using (SqlConnection con = new SqlConnection(util.strElect))
            {

                SqlCommand cmd = new SqlCommand("INSERT tblfeedback(Name,Email,Message)" + "VALUES (@Name,@Email,@Query)", con);

                cmd.Parameters.AddWithValue("@Name", (string.IsNullOrEmpty(Name) ? "" : Name));
                cmd.Parameters.AddWithValue("@Email", (string.IsNullOrEmpty(Email) ? "" : Email));
                cmd.Parameters.AddWithValue("@Query", (string.IsNullOrEmpty(Query) ? "" : Query));

                    if (con.State == ConnectionState.Closed)
                        con.Open();
                    execnon = cmd.ExecuteNonQuery();

                    if (execnon > 0)
                    {
                        message = "ok";
                        status = "e";

                        System.Text.StringBuilder sbodyo = new System.Text.StringBuilder();
                        sbodyo.Append("<P>Name         :   " + Name + "</P>");
                        sbodyo.Append("<P>Email        :  " + Email + "</P>");

                        sbodyo.Append("<P>Description  :" + (string.IsNullOrEmpty(Query) ? "" : Query) + "</P>");

                        SendMailnew1("support@indiastatquiz.com", "support@indiastatquiz.com", sbodyo.ToString(), Subject);

                        var Data = new { message = message, status = status };
                        var data = JsonConvert.SerializeObject(Data);
                        return Content(data, "application/json");
                    }
                    else
                    {
                        var Data = new { message = "not", status = "not" };
                        var data = JsonConvert.SerializeObject(Data);
                        return Content(data, "application/json");
                    }
             
            }
            }
            catch (Exception ex)
            {
                var Data = new { message = "not", status = "not" };
                var data = JsonConvert.SerializeObject(Data);
                return Content(data, "application/json");
            }
        }
        public static void SendMailnew1(string mailfrom, string mailto, string body, string subject)
        {
            try
            {
                MailMessage MyMail = new MailMessage();
                MyMail.From = new MailAddress(mailfrom);
                MyMail.To.Add(mailto);
                MyMail.Subject = subject;
                //  MyMail.Bcc.Add("ajay@bsdinfotech.com");
                ///    MyMail.CC.Add("ceojharkhand1@gmail.com");
                MyMail.IsBodyHtml = true;
                MyMail.Body = body;
                MyMail.Priority = MailPriority.Normal;
                SmtpClient smtpMailObj = new SmtpClient();
                smtpMailObj.Host = ISSMTPSERVER;
                smtpMailObj.Port = ISSMTPPORT;
                smtpMailObj.Credentials = new System.Net.NetworkCredential(MAIL_USERNAME, MAIL_PASSWORD);
                smtpMailObj.EnableSsl = false;
                smtpMailObj.Send(MyMail);
            }
            catch (Exception ex)
            {
            }
        }
        public IActionResult forgotForgot()
        {
            return View();
        }

    }
}

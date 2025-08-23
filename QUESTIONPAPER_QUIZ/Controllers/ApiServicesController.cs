using System;
using System.Data;
using System.Runtime.Intrinsics.Arm;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Web;
using System.IO;
using System.Drawing;
using Newtonsoft.Json.Linq;
using System.Xml.Linq;
using QUESTIONPAPER_QUIZ.Models;
using System.Text;
using static System.Net.WebRequestMethods;
using System.Net;
using QUESTIONPAPER_QUIZ;

namespace Dezigncompany.Controllers
{
    [Route("api/[controller]")]

    [ApiController]
    public class ApiServicesController : ControllerBase
    {
        Utility Util = new Utility();
        ClsUtility ClsUtil = new ClsUtility();
        DataTable dt = new DataTable();
        DataSet ds = new DataSet();

        #region Master

        [Route("ApiAll")]
        public IActionResult ApiAll(string? Data = "")
        {
            if (Data == "")
            {
                Data = Request.Form["Data"].ToString();
            }
            string data = "";

            try
            {
                DataSet ds = Util.Fill("SP_ApiAll '" + Data + "'", Util.cs);
                data = ds.Tables[0].Rows[0]["Data"].ToString();
            }
            catch (Exception ex)
            {
                data = "{\"Message\":\"" + ex.Message + "\",\"Status\":\"error\",\"Data\":\"[]\"}";
            }
            return Content(data, "application/json");
        }

        [Route("ALLDATA")]
        public IActionResult ALLDATA(DelhiElection election)
        {
            string message = "", status = "";
            dynamic captchaHash = HttpContext.Session.GetString("Captcha");
            if (captchaHash == Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(election.Captcha.ToUpper()))))
            {

                string sqlquery = "exec SP_DELHIELECTIONQUIZ_Api @type=" + election.Type + ",@Email='" + election.Email + "'";
                ds = Util.TableBind(sqlquery);
                dt = ds.Tables[0];
                if (dt.Rows.Count > 0)
                {
                    message = "Success";
                    status = "Success";
                }
                else
                {
                    message = "Your email is not matched with our records.";
                    status = "Error";
                }
            }
            else
            {
                message = "Wrong captcha code";
                status = "Error";
            }
            var Data = new { message = message, status = status, dt = dt };
            var data = JsonConvert.SerializeObject(Data);
            return Content(data, "application/json");
        }

        [Route("GetDate")]
        public IActionResult GetDate(DelhiElection election)
        {
            string message = "", status = "";
            dynamic captchaHash = HttpContext.Session.GetString("Captcha");
            if (captchaHash == Convert.ToBase64String(System.Security.Cryptography.MD5.Create().ComputeHash(Encoding.UTF8.GetBytes(election.Captcha.ToUpper()))))
            {
                string sqlquery = "exec SP_forgot_Api @type=" + election.Type + ",@Email='" + election.Email + "'";
                ds = Util.TableBind(sqlquery);
                dt = ds.Tables[0];
                if (dt.Rows.Count > 0)
                {

                    message = "Success";
                    status = "Success";

                    WebClient client = new System.Net.WebClient();
                    client.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR1.0.3705;)");

                    if (dt.Rows[0]["PMobNo"].ToString() != "")
                    {

                     //   Stream data2 = client.OpenRead("https://103.229.250.200/smpp/sendsms?username=datanet&password=Indiastat@007&to=" + dt.Rows[0]["PMobNo"].ToString() + "&from=DTANET&text=Forget%20Password%20IndiastatQuiz:%20your%20password%20is%20" + dt.Rows[0]["Rpassword"].ToString() + "%20while%20your%20email%20is%20your%20user%20name.%20|%20Datanet%20India");

                        Stream data2 = client.OpenRead("https://103.229.250.200/smpp/sendsms?username=datanet&password=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5teXZhbHVlZmlyc3QuY29tL3BzbXMiLCJzdWIiOiJkYXRhbmV0IiwiZXhwIjoyMDY3MDY3MzM1fQ.hY-Ss4WYTmwEaweQWSjj5bzOIILVzWzQlo7whclURSo&to=91" + dt.Rows[0]["PMobNo"].ToString() + "&from=INQUIZ&text=रामचरितमानस क्विज: आपका Password: " + dt.Rows[0]["Rpassword"].ToString() + ", Username: आपकी ईमेल। Datanet");

                        data2.Close();
                    }
                    else
                    {
                        message = "आपका ईमेल हमारे रिकॉर्ड से मेल नहीं खाता है। यदि आपने पहले से पंजीकरण किया है, तो कृपया सही ईमेल का उपयोग करें।";
                        status = "Error";

                    }
                }
                else
                {
                    message = "आपका ईमेल हमारे रिकॉर्ड से मेल नहीं खाता है। यदि आपने पहले से पंजीकरण किया है, तो कृपया सही ईमेल का उपयोग करें।";
                    status = "Error";
                }
            }
            else
            {
                message = "Wrong captcha code";
                status = "Error";
            }
            var Data = new { message = message, status = status, dt = dt };
            var data = JsonConvert.SerializeObject(Data);
            return Content(data, "application/json");
        }
        #endregion


        #region Valimiki Api

        [Route("QuizApi")]
        public IActionResult QuizApi(string? jsonData = "")
        {
            if (jsonData == "")
            {
                jsonData = Request.Form["jsonData"].ToString();
            }
            string data = "";

            try
            {
                DataSet ds = Util.Fill("SP_QuizApi N'" + jsonData + "'", Util.cs);
                data = ds.Tables[0].Rows[0]["Data"].ToString();
            }
            catch (Exception ex)
            {
                data = "{\"Message\":\"" + ex.Message + "\",\"Status\":\"error\",\"Data\":\"[]\"}";
            }
            return Content(data, "application/json");
        }

        #endregion

    }
}

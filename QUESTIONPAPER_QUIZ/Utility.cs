using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace QUESTIONPAPER_QUIZ
{
    public class Utility
    {
        ClsUtility util = new ClsUtility();
        //node-1
        //SqlConnection sqcon = new SqlConnection(@"Data Source=216.48.179.255,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8");
        //public string strElect = @"Data Source=216.48.179.255,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8";

        //public string cs = @"Data Source=216.48.179.255,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8;MultipleActiveResultSets=True;pooling=true;Max Pool Size=10000;Connection Timeout=30";

        //node-2
        //SqlConnection sqcon = new SqlConnection(@"Data Source=216.48.185.85,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8");
        //public string strElect = @"Data Source=216.48.185.85,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8";

        //public string cs = @"Data Source=216.48.185.85,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8;MultipleActiveResultSets=True;pooling=true;Max Pool Size=10000;Connection Timeout=30";
        // node-3
        //SqlConnection sqcon = new SqlConnection(@"Data Source=216.48.185.100,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8");
        //public string strElect = @"Data Source=216.48.185.100,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8";

        //public string cs = @"Data Source=216.48.185.100,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8;MultipleActiveResultSets=True;pooling=true;Max Pool Size=10000;Connection Timeout=30";

        //node-4
        //SqlConnection sqcon = new SqlConnection(@"Data Source=216.48.185.135,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8");
        //public string strElect = @"Data Source=216.48.185.135,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8";

        SqlConnection sqcon = new SqlConnection(@"Data Source=101.53.144.187,1533;Initial Catalog=INDIASTATQUIZ;User ID=indiastatquiz;Password=India@2025$%");
        public string strElect = @"Data Source=101.53.144.187,1533;Initial Catalog=INDIASTATQUIZ;User ID=indiastatquiz;Password=India@2025$%";

        public string cs = @"Data Source=101.53.144.187,1533;Initial Catalog=INDIASTATQUIZ;User ID=indiastatquiz;Password=India@2025$%";
        //public string cs = @"Data Source=216.48.185.135,1533;Initial Catalog=INDIASTATQUIZ;User ID=sa;Password=MW{N~go=V26DNT-y@8;MultipleActiveResultSets=True;pooling=true;Max Pool Size=10000;Connection Timeout=30";



        SqlCommand sqcmd;
        SqlDataAdapter SqlDa;
        internal object clubster;

        int max = 0;

        public DataTable execQuery(string sql)
        {
            DataTable dt = new DataTable();
            try
            {
                //Writejson(sql + "" + sqcon);
                //WriteLogFile("Connection", "execQuery", "Check Connection");
                sqcmd = new SqlCommand(sql, sqcon);
                SqlDa = new SqlDataAdapter(sqcmd);
                SqlDa.Fill(dt);
            }
            catch (Exception exce)
            {
            }
            return dt;
        }
        public string cryption(string text)
        {
            char[] pwd;
            string passwd = "";
            if (text == "")
            {

            }
            else
            {
                text = FixQuotes(text);
                pwd = text.ToCharArray();
                try
                {
                    for (int I = 0; I < pwd.Length; I++)
                    {
                        int k = (int)pwd[I];
                        k += 128;
                        passwd += (char)k;
                    }
                }
                catch (Exception exce)
                {
                    throw exce;
                }
            }
            return passwd;
        }
        public string InsUpdtVendorForm(string JsonData, string Constr)
        {
            //string querry = "exec Usp_SaveAdminData '" + JsonData + "'";
            string querry = "";
            //util.WriteLogFile("Apilog", "input'" + JsonData + "'", "", "", "", "", "", "", "InsUpdt");
            using (SqlConnection sqcon = new SqlConnection(Constr))
            {
                SqlTransaction SqlTran = null;
                DataTable dt = new DataTable();
                try
                {
                    if (sqcon.State == ConnectionState.Open)
                    { sqcon.Close(); }
                    sqcon.Open();
                    SqlTran = sqcon.BeginTransaction();
                    SqlCommand sqcmd = new SqlCommand(JsonData, sqcon, SqlTran);
                    sqcmd.CommandTimeout = 0;
                    SqlDataAdapter SqlDa = new SqlDataAdapter(sqcmd);
                    SqlDa.Fill(dt);
                    SqlTran.Commit();
                    if (dt.Rows.Count > 0)
                    {
                        querry = dt.Rows[0]["data"].ToString();
                    }
                    else
                    {
                        querry = "Successfull";
                    }
                }
                catch (Exception exce)
                {
                    querry = "Transaction Rolleutilck. Due to " + exce.Message;
                    util.WriteLogFile("Errorlog", "Input--'" + JsonData + "'OutPut--'" + exce.Message + "'", "", "", "", "", "", "", "InsUpdt");
                }
                finally
                {
                    sqcon.Close();

                }
            }
            return querry;
        }

        public void sendSMS(string otp, string mobileno)
        {
            try
            {

                WebClient client = new System.Net.WebClient();
                client.Headers.Add("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.2; .NET CLR1.0.3705;)");
                if (mobileno != "")
                {
                    Stream data = client.OpenRead(SMSAPI(otp, mobileno));
                    data.Close();
                }
            }
            catch (Exception ex)
            {
                //Util.WriteLogFile(this.Name, "SendSMS()", ex.ToString());
            }
        }
        public string SMSAPI(string msg, string mobno)
        {


            string baseurl = "https://api.smartping.ai/fe/api/v1/send?username=dezico.trans&password=Dezico@24!&unicode=false&from=DEZICO&to=" + mobno + "&text=Your%20One-Time%20Password%20(OTP)%20for%20login%20is:%20" + msg + ".%20This%20OTP%20will%20expire%20in%205%20minutes.%20Dezign%20Company";


            return baseurl;
        }
        public string FixQuotes(string strValue)
        {
            string strRestrict = "";
            strRestrict = strValue.Replace("'", "");
            string[] badstuffs = { ";", "--", "xp_", "*", "<", ">", "[", "]", "(", ")", "select", "union", "drop", "insert", "delete", "update" };
            if (strRestrict != "")
            {
                for (int i = 0; i < badstuffs.Length; i++)
                {
                    strRestrict = strRestrict.Replace(badstuffs[i], "").Trim();
                }
            }
            else
            {
                strRestrict = "";
            }
            return strRestrict;
        }
        public string ExecQuery(string query, string constring = "")
        {
            using (SqlConnection sqcon = new SqlConnection(constring))
            {
                SqlTransaction SqlTran = null;
                DataTable dt = new DataTable();
                try
                {
                    if (sqcon.State == ConnectionState.Open)
                    { sqcon.Close(); }
                    sqcon.Open();
                    SqlTran = sqcon.BeginTransaction();
                    SqlCommand sqcmd = new SqlCommand(query, sqcon, SqlTran);
                    sqcmd.CommandTimeout = 0;

                    SqlDataAdapter SqlDa = new SqlDataAdapter(sqcmd);
                    SqlDa.Fill(dt);

                    SqlTran.Commit();
                    if (dt.Rows.Count > 0)
                    {
                        query = dt.Rows[0]["Message"].ToString();
                    }
                    else
                    {
                        query = "Successfull";
                    }

                }
                catch (Exception exce)
                {
                    query = "Transaction Rolleutilck. Due to " + exce.Message;
                    WriteLogFile("Errorlog", "input'" + query + "---Output--" + exce.Message + "'", "", "", "", "", "", "", "Fill");
                }
                finally
                {
                    sqcon.Close();
                }
            }
            return query;
        }

        public DataSet Fill(string sql, string constring)
        {
            DataSet ds = new DataSet();
            util.WriteLogFile("Apilog", "input'" + sql + "'", "", "", "", "", "", "", "Fill");
            using (SqlConnection sqcon = new SqlConnection(constring))
            {
                try
                {
                    SqlCommand sqcmd = new SqlCommand(sql, sqcon);
                    sqcmd.CommandTimeout = 0;
                    SqlDataAdapter SqlDa = new SqlDataAdapter(sqcmd);
                    SqlDa.Fill(ds);
                }
                catch (Exception exce)
                {
                    DataSet dset = new DataSet();
                    DataTable dt = new DataTable();
                    dt.Columns.Add("Data");
                    DataRow dr = dt.NewRow();

                    dr[0] = "{\"Message\":\"" + exce.Message + "\",\"Status\":\"error\",\"Data\":\"[]\"}";
                    dt.Rows.Add(dr);
                    dset.Tables.Add(dt);

                    util.WriteLogFile("Errorlog", "input'" + sql + "---Output--" + exce.Message + "'", "", "", "", "", "", "", "Fill");
                    return dset;

                }
            }
            return ds;
        }

        public string MultipleTransactions(string query)
        {
            SqlTransaction SqlTran = null;
            try
            {
                sqcon.Open();
                SqlTran = sqcon.BeginTransaction();
                sqcmd = new SqlCommand(query, sqcon, SqlTran);
                sqcmd.ExecuteNonQuery();
                SqlTran.Commit();
                query = "Successfull";
            }
            catch (Exception exce)
            {
                SqlTran.Rollback();
                query = "Transaction Rolledback. Due to " + exce.Message;
            }
            finally
            {
                sqcon.Close();
            }
            return query;
        }
        public DataTable GetSingleTable(string strq, int cmdtimeout = 20, string constring = "")
        {
            //util.WriteLogFile("Apilog", "input'" + strq + "'", "", "", "", "", "", "", "InsUpdt");
            DataTable dt = new DataTable();
            try
            {

                using (SqlConnection con = new SqlConnection(constring))
                using (SqlCommand cmd = new SqlCommand(strq, con))
                {
                    cmd.CommandTimeout = cmdtimeout;
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        da.Fill(dt);
                }
            }
            catch (Exception ex)
            {
                //util.WriteLogFile("Errorlog", "OutPut'" + ex.Message + "'", "", "", "", "", "", "", "InsUpdt");
            }
            return dt;
        }
        public DataTable SelectParticular(string tables, string ColName, string sqcondition)
        {
            DataTable ResSet = new DataTable();
            try
            {
                string query = "select " + ColName + " from " + tables + " where " + sqcondition;
                SqlDa = new SqlDataAdapter(query, sqcon);
                SqlDa.Fill(ResSet);
            }
            catch (Exception exce)
            {
            }
            return ResSet;
        }

        public DataSet TableBind(string query)
        {
            DataTable dt = new DataTable();
            DataSet ds = new DataSet();
            try
            {
                using (SqlConnection sqlcon = new SqlConnection(strElect))
                {
                    sqlcon.Open();
                    SqlCommand cmd = new SqlCommand(query, sqlcon);
                    SqlDataAdapter sqlda = new SqlDataAdapter(cmd);
                    sqlda.Fill(ds);
                    sqlcon.Close();
                }
            }
            catch (Exception exce)
            {

            }
            return ds;
        }

        public DataSet BindDropDown(string Query)
        {
            using (SqlConnection con = new SqlConnection(strElect))
            {
                SqlCommand com = new SqlCommand(Query, con);
                SqlDataAdapter da = new SqlDataAdapter(com);
                DataSet ds = new DataSet();
                da.Fill(ds);
                return ds;
            }
        }

        public string BindDiv(DataTable dt)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='data-table' class='table table-bordered table-hover w-100 dataTable dtr-inline'><thead><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th class='thead-dark' style='border-color:#9c9c9c;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");
            }
            sb.Append("</tr></thead>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");
                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }
        public string BindDivn(DataTable dt)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='table' class='table table-bordered table-hover w-100 dataTable dtr-inline'><thead><tr><td colspan='4' style='padding:10px;'>District-wise Total Registration for Election Quiz (As on " + DateTime.Now.ToString("dddd, dd MMMM yyyy") + ")</td></tr><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th class='thead-dark' style='border-color:#9c9c9c;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");
            }
            sb.Append("</tr></thead>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");
                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }
        public string BindDiv01(DataTable dt, string tid)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='" + tid + "' class='table table-bordered table-hover w-100 dataTable dtr-inline'><thead><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th class='thead-dark' style='color: #000000;background-color:#dadada;border-color:#9c9c9c;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");

            }
            sb.Append("</tr></thead>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable1'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");

                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }
        public string BindDiv1(DataTable dt)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='data-table1' class='table table-bordered table-hover w-100 dataTable dtr-inline'><thead><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th class='thead-dark' style='color:#000000;background-color:#dadada;border-color:#9c9c9c;height:20px;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");

            }
            sb.Append("</tr></thead>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable1'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");

                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }

        public string BindDiv1n(DataTable dt)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='table' class='table table-bordered table-hover w-100 dataTable dtr-inline'><thead><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th class='thead-dark' style='color:#000000;background-color:#dadada;border-color:#9c9c9c;height:20px;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");

            }
            sb.Append("</tr></thead>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable1'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");

                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }

        public List<SelectListItem> PopulateDropDown(string Query, string constring, string select = "")
        {
            //int max = 0;
            DataTable dt = new DataTable();
            List<SelectListItem> ddl = new List<SelectListItem>();
            try
            {

                using (SqlConnection con = new SqlConnection(constring))
                using (SqlCommand cmd = new SqlCommand(Query, con))
                {
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        da.Fill(dt);
                }
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        ddl.Add(new SelectListItem { Text = dt.Rows[i][1].ToString(), Value = dt.Rows[i][0].ToString() });
                    }
                }

                //max = Convert.ToInt32(dt.AsEnumerable().Max(row => row["id"]));
                //select = maximum;
                //if (select != "")
                //{
                //    var selddl = ddl.ToList().Where(x => x.Value = select).First();
                //    selddl.Selected = true;
                //}


            }
            catch (Exception ex)
            {
                WriteLogFile("Errorlog", "input'" + Query + "---Output--" + ex.Message + "'", "", "", "", "", "", "", "Fill");
            }
            return ddl;
        }


        public List<SelectListItem> PopulateDropDownjson(string Query, string constring, string select = "")
        {
            //int max = 0;
            DataTable dt = new DataTable();
            DataTable jdt = new DataTable();
            List<SelectListItem> ddl = new List<SelectListItem>();
            try
            {

                using (SqlConnection con = new SqlConnection(constring))
                using (SqlCommand cmd = new SqlCommand(Query, con))
                {
                    using (SqlDataAdapter da = new SqlDataAdapter(cmd))
                        da.Fill(jdt);
                }
                dt= JsonConvert.DeserializeObject<DataTable>(jdt.Rows[0]["Data"].ToString());
               // -- dt= JsonConvert.DeserializeObject<DataTable>(jdt.Rows[0]["Data"]).ToString());
                if (dt.Rows.Count > 0)
                {
                    for (int i = 0; i < dt.Rows.Count; i++)
                    {
                        ddl.Add(new SelectListItem { Text = dt.Rows[i][1].ToString(), Value = dt.Rows[i][0].ToString() });
                    }
                }

                //max = Convert.ToInt32(dt.AsEnumerable().Max(row => row["id"]));
                //select = maximum;
                //if (select != "")
                //{
                //    var selddl = ddl.ToList().Where(x => x.Value = select).First();
                //    selddl.Selected = true;
                //}


            }
            catch (Exception ex)
            {
                WriteLogFile("Errorlog", "input'" + Query + "---Output--" + ex.Message + "'", "", "", "", "", "", "", "Fill");
            }
            return ddl;
        }

        public void WriteLogFile(string LogPath, string Query, string Button, string Page, string IP, string BrowserName, string BrowerVersion, string javascript, string function)
        {
            try
            {

                if (!string.IsNullOrEmpty(Query))
                {
                    string path = Path.Combine("wwwroot/LOG/" + LogPath + "/" + System.DateTime.UtcNow.ToString("dd-MM-yyyy") + ".txt");

                    if (!File.Exists(path))
                    {
                        File.Create(path).Dispose();

                        using (System.IO.FileStream file = new FileStream(path, FileMode.Append, FileAccess.Write))
                        {

                            StreamWriter streamWriter = new StreamWriter(file);

                            streamWriter.WriteLine((((((((System.DateTime.Now + " - ") + Query + " - ") + Button + " - ") + Page + " - ") + IP + " - ") + BrowserName + " - ") + BrowerVersion + " - ") + javascript + function);

                            streamWriter.Close();

                        }
                    }
                    else
                    {
                        using (System.IO.FileStream file = new FileStream(path, FileMode.Append, FileAccess.Write))
                        {
                            StreamWriter streamWriter = new StreamWriter(file);
                            streamWriter.WriteLine((((((((System.DateTime.Now + " - ") + Query + " - ") + Button + " - ") + Page + " - ") + IP + " - ") + BrowserName + " - ") + BrowerVersion + " - ") + javascript + function);
                            streamWriter.Close();
                        }
                    }

                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

    }

    public class ClsUtility
    {
        public string BindDiv(DataTable dt, string v)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='data-table' class='table table-bordered table-hover w-100 dataTable dtr-inline'><thead><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th class='thead-dark' style='color: #fff;background-color: #50859e;border-color:#9c9c9c;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");

            }
            sb.Append("</tr></thead>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");

                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }

        public string BindDivMap(DataTable dt, string tableid)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("<table id='" + tableid + "' class='table table-bordered'><tr>");
            foreach (DataColumn column in dt.Columns)
            {
                sb.Append("<th style='color: #000000;background-color:#dadada;border-color:#9c9c9c;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + column.ColumnName + "</th>");
            }
            sb.Append("</tr>");
            foreach (DataRow row in dt.Rows)
            {
                sb.Append("<tr id='mytable'>");
                foreach (DataColumn column in dt.Columns)
                {
                    sb.Append("<td  style='width:100px;border: 1px solid #ccc;" + (column.ColumnName.Contains("Hid_") == true ? "display:none;" : "") + "'>" + row[column.ColumnName].ToString() + "</td>");
                }
                sb.Append("</tr>");
            }
            sb.Append("</table>");
            return (sb.ToString());
        }

        public void WriteLogFile(string LogPath, string Query, string Button, string Page, string IP, string BrowserName, string BrowerVersion, string javascript, string function)
        {
            try
            {

                if (!string.IsNullOrEmpty(Query))
                {
                    string path = Path.Combine("wwwroot/LOG/" + LogPath + "/" + System.DateTime.UtcNow.ToString("dd-MM-yyyy") + ".txt");

                    if (!File.Exists(path))
                    {
                        File.Create(path).Dispose();

                        using (System.IO.FileStream file = new FileStream(path, FileMode.Append, FileAccess.Write))
                        {

                            StreamWriter streamWriter = new StreamWriter(file);

                            streamWriter.WriteLine((((((((System.DateTime.Now + " - ") + Query + " - ") + Button + " - ") + Page + " - ") + IP + " - ") + BrowserName + " - ") + BrowerVersion + " - ") + javascript + function);

                            streamWriter.Close();

                        }
                    }
                    else
                    {
                        using (System.IO.FileStream file = new FileStream(path, FileMode.Append, FileAccess.Write))
                        {

                            StreamWriter streamWriter = new StreamWriter(file);

                            streamWriter.WriteLine((((((((System.DateTime.Now + " - ") + Query + " - ") + Button + " - ") + Page + " - ") + IP + " - ") + BrowserName + " - ") + BrowerVersion + " - ") + javascript + function);

                            streamWriter.Close();

                        }
                    }

                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }
        public string SendMailViaIIS_htmls(string from, string to, string cc, string bcc, string subject, string _body, string MAIL_PASSWORD, string Host, string attachPath = "")
        {
            //create the mail message
            string functionReturnValue = null;
            string _from = from, _to = to, _cc = cc, _bcc = bcc, _subject = subject; //MAIL_PASSWORD = "15M7Y1998@$";
            try
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                //set the addresses
                if (_from.Trim().Length == 0)
                {
                    _from = "support@dezigncompany.com";
                    //_from = """Support Team"" support@indiastat.com"
                }
                mail.From = new System.Net.Mail.MailAddress(_from);

                if (_to.Trim().Length > 0)
                {
                    mail.To.Add(new System.Net.Mail.MailAddress(_to));
                }
                if (_cc.Trim().Length > 0)
                {
                    mail.CC.Add(new System.Net.Mail.MailAddress(_cc));
                }
                if (bcc.Trim().Length > 0 & bcc.Trim() != "none")
                {
                    mail.Bcc.Add(new System.Net.Mail.MailAddress(_bcc));
                }
                else if (bcc.Trim().Length == 0 & bcc.Trim() != "none")
                {
                    //mail.Bcc.Add(New system.net.mail.mailaddress("support@indiastat.com"))
                    //mail.Bcc.Add(New system.net.mail.mailaddress("diplnd07@gmail.com"))
                }

                if (!string.IsNullOrEmpty(attachPath))
                {
                    System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(attachPath);
                    //create the attachment
                    mail.Attachments.Add(attachment);
                    //add the attachment
                }
                mail.Subject = _subject;
                mail.Body = _body;
                mail.IsBodyHtml = true;
                System.Net.Mail.SmtpClient SmtpClient = new System.Net.Mail.SmtpClient();
                //SmtpClient.Host = iConfig.GetSection("ISSMTPSERVER").Value;
                //SmtpClient.Port = Convert.ToInt32(iConfig.GetSection("ISSMTPPORT").Value);
                //   SmtpClient.Host = Host;//"mail.bsdinfotech.com";
                SmtpClient.Host = "180.179.213.214";
                SmtpClient.Credentials = new NetworkCredential(_from, "Gf8c2i1$5");
                SmtpClient.Port = 587;
                SmtpClient.Send(mail);
                functionReturnValue = "Sent";
                mail.Dispose();
                SmtpClient = null;
            }
            catch (System.FormatException ex)
            {
                functionReturnValue = ex.Message;
            }
            catch (SmtpException ex)
            {
                functionReturnValue = ex.Message;
            }
            catch (System.Exception ex)
            {
                functionReturnValue = ex.Message;
            }
            return functionReturnValue;
        }

        public string SendMailViaIIS_html(string from, string to, string cc, string bcc, string subject, string attach, string _body, IConfiguration iConfig, string MAIL_PASSWORD, string Host, string attachPath = "")
        {
            //create the mail message
            string functionReturnValue = null;
            string _from = from, _to = to, _cc = cc, _bcc = bcc, _subject = subject; //MAIL_PASSWORD = "15M7Y1998@$";
            try
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                //set the addresses
                if (_from.Trim().Length == 0)
                {
                    _from = "support@dezigncompany.com";
                    //_from = """Support Team"" support@indiastat.com"
                }
                mail.From = new System.Net.Mail.MailAddress(_from);

                if (_to.Trim().Length > 0)
                {
                    mail.To.Add(new System.Net.Mail.MailAddress(_to));
                }
                if (_cc.Trim().Length > 0)
                {
                    mail.CC.Add(new System.Net.Mail.MailAddress(_cc));
                }
                if (bcc.Trim().Length > 0 & bcc.Trim() != "none")
                {
                    mail.Bcc.Add(new System.Net.Mail.MailAddress(_bcc));
                }
                else if (bcc.Trim().Length == 0 & bcc.Trim() != "none")
                {
                    //mail.Bcc.Add(New system.net.mail.mailaddress("support@indiastat.com"))
                    //mail.Bcc.Add(New system.net.mail.mailaddress("diplnd07@gmail.com"))
                }

                if (!string.IsNullOrEmpty(attachPath))
                {
                    System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(attachPath);
                    //create the attachment
                    mail.Attachments.Add(attachment);
                    //add the attachment
                }
                mail.Subject = _subject;
                mail.Body = _body;
                mail.IsBodyHtml = true;
                System.Net.Mail.SmtpClient SmtpClient = new System.Net.Mail.SmtpClient();
                //SmtpClient.Host = iConfig.GetSection("ISSMTPSERVER").Value;
                //SmtpClient.Port = Convert.ToInt32(iConfig.GetSection("ISSMTPPORT").Value);
                //SmtpClient.Host = Host;//"mail.bsdinfotech.com";
                SmtpClient.Host = "180.179.213.214";
                SmtpClient.Credentials = new NetworkCredential(_from, "Gf8c2i1$5");
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
            catch (SmtpException ex)
            {
                functionReturnValue = ex.Message;
            }
            catch (System.Exception ex)
            {
                functionReturnValue = ex.Message;
            }
            return functionReturnValue;
        }

        public string SendMailViaIIS_html1(string from, string to, string cc, string bcc, string subject, string _body, string MAIL_PASSWORD, string Host, string attachPath = "")
        {
            //create the mail message
            string functionReturnValue = null;
            string _from = from, _to = to, _cc = cc, _bcc = bcc, _subject = subject; //MAIL_PASSWORD = "15M7Y1998@$";
            try
            {
                System.Net.Mail.MailMessage mail = new System.Net.Mail.MailMessage();
                //set the addresses
                if (_from.Trim().Length == 0)
                {
                    _from = "support@dezigncompany.com";
                    //_from = """Support Team"" support@indiastat.com"
                }
                mail.From = new System.Net.Mail.MailAddress(_from);

                if (_to.Trim().Length > 0)
                {
                    mail.To.Add(new System.Net.Mail.MailAddress(_to));
                }
                if (_cc.Trim().Length > 0)
                {
                    mail.CC.Add(new System.Net.Mail.MailAddress(_cc));
                }
                if (bcc.Trim().Length > 0 & bcc.Trim() != "none")
                {
                    mail.Bcc.Add(new System.Net.Mail.MailAddress(_bcc));
                }
                else if (bcc.Trim().Length == 0 & bcc.Trim() != "none")
                {
                    //mail.Bcc.Add(New system.net.mail.mailaddress("support@indiastat.com"))
                    //mail.Bcc.Add(New system.net.mail.mailaddress("diplnd07@gmail.com"))
                }

                if (!string.IsNullOrEmpty(attachPath))
                {
                    System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(attachPath);
                    //create the attachment
                    mail.Attachments.Add(attachment);
                    //add the attachment
                }
                mail.Subject = _subject;
                mail.Body = _body;
                mail.IsBodyHtml = true;
                System.Net.Mail.SmtpClient SmtpClient = new System.Net.Mail.SmtpClient();
                //SmtpClient.Host = iConfig.GetSection("ISSMTPSERVER").Value;
                //SmtpClient.Port = Convert.ToInt32(iConfig.GetSection("ISSMTPPORT").Value);
                //SmtpClient.Host = Host;//"mail.bsdinfotech.com";
                SmtpClient.Host = "180.179.213.214";
                //SmtpClient.Host = "webmail.dezigncompany.com";
                SmtpClient.Credentials = new NetworkCredential(_from, "Gf8c2i1$5");
                SmtpClient.Port = 587;
                SmtpClient.Send(mail);
                functionReturnValue = "Sent";
                mail.Dispose();
                SmtpClient = null;
            }
            catch (System.FormatException ex)
            {
                functionReturnValue = ex.Message;
            }
            catch (SmtpException ex)
            {
                functionReturnValue = ex.Message;
            }
            catch (System.Exception ex)
            {
                functionReturnValue = ex.Message;
            }
            return functionReturnValue;
        }

        public void SMSAPInewwithmsg(string msg)
        {

            // WriteLogFile(msg, "", "", "", "", "", "");

            HttpWebRequest myReq = (HttpWebRequest)WebRequest.Create(msg);


            //   HttpWebRequest myReq = (HttpWebRequest)WebRequest.Create("http://149.20.191.19/VSServices/SendSms.ashx?login=AjayKumar&pass=AjayKumar854D&text="+msg+"&from=ACKAFO&to=91"+mobno+"");

            HttpWebResponse myResp = (HttpWebResponse)myReq.GetResponse();
            System.IO.StreamReader respStreamReader = new System.IO.StreamReader(myResp.GetResponseStream());
            string responseString = respStreamReader.ReadToEnd();
            respStreamReader.Close();
            myResp.Close();
        }

        //internal string BindDiv(DataTable dt)
        //{
        //    throw new NotImplementedException();
        //}
    }
}

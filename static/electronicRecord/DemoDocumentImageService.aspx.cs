namespace DCSoft.ASPNETDemo
{
public partial class DemoDocumentImageService : System.Web.UI.Page
{
  protected void Page_Load(object sender, EventArgs e)
        {
            System.Web.HttpContext.Current.Response.AddHeader("Cache-Control","public,max-age=31536000");
            WebWriterControlServicePageExecuter executer = new WebWriterControlServicePageExecuter();
            executer.CrossDomainSettings.Enabled = true;
            executer.EventReadFileContent = new WriterReadFileContentEventHandler(this.My_ReadFileContent);
          //  executer.EventsaveFileContent = new WriterSaveFileContentEventHandler();

            if (executer.HandleService(this))
            {
                return;
            }
        }
  private void  My_ReadFileContent(object sender , WriterReadFileContentEventArgs args){
      XTextDocument doc = new XTextDocument(); // 创建一个空的文档对象
      string rootDir = System.Web.HttpContext.Current.Server.MapPath("//");
      string fileName = args.FileName.Replace(@"/",@"\");// 获取前端传值
      fileName = Path.Combine(rootDir,fileName);//处理文件路径，可从数据库加载
      if(System.IO.File.Exists(fileName)){
          doc.loadFromFile(fileName,"xml");
          args.ResultBinary = doc.SaveToBinary("xml") // 将获取到的xml发送给事件返回给前端；
          args.Handled = true ;

      }


  }
}
}
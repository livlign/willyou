using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using willyou.Models;

namespace willyou.Pages
{
    public class IndexModel : PageModel
    {
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly string RootFolder;
        private readonly string IdeaFolder;
        public IndexModel(IWebHostEnvironment hostEnvironment)
        {
            _hostEnvironment = hostEnvironment;
            RootFolder = _hostEnvironment.WebRootPath;
            IdeaFolder = Path.Combine(RootFolder, "Ideas");
        }
        public HiddenIdea Idea { get; set; }
        public void OnGet(double id)
        {
            if (id > 0)
            {
                var data = System.IO.File.ReadAllText(IdeaFolder + "/" + id);
                ViewData["Idea"] = JsonConvert.DeserializeObject<HiddenIdea>(data);
            }
        }
        public JsonResult OnPost([FromBody] HiddenIdea idea)
        {
            if (!Directory.Exists(IdeaFolder)) 
                Directory.CreateDirectory(IdeaFolder);

            var id = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            var data = JsonConvert.SerializeObject(idea);

            using (StreamWriter writer = System.IO.File.AppendText(IdeaFolder + "/" + id))
            {
                writer.WriteLine(data);
            }

            return new JsonResult(id);
        }       
    }
}
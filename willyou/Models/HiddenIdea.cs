using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace willyou.Models
{
    public class HiddenIdea
    {
        public int FontId { get; set; }
        public string MainText { get; set; }
        public string EndText { get; set; }
        public string BtnLeftText { get; set; }
        public string BtnRightText { get; set; }
        public long? TextSize { get; set; }
        public long? WritingSpeed { get; set; }
        public bool MovingButton { get; set; }
        public bool MenuSuggestion { get; set; }
    }
}

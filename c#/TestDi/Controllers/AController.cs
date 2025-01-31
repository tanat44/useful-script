using Microsoft.AspNetCore.Mvc;
using TestDi.Services;

namespace TestDi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AController : ControllerBase
    {
        private IAService _aService;
        private readonly ILogger<AController> _logger;
        public AController(ILogger<AController> logger, IAService aService)
        {
            _logger = logger;
            _aService = aService;
        }

        [HttpGet]
        public void Get()
        {
            _aService.Log("Cola");
        }
    }
}

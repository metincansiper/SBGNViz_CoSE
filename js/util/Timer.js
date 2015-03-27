function Timer() {
}

Timer.startTime;

Timer.start = function ()
{
  Timer.startTime = new Date().getTime();
};

Timer.stop = function (jobName, log)
{
  var endTime = new Date().getTime();
  var total = endTime - Timer.startTime;
  if (log != null && log == true)
    console.log(jobName + " took: " + total + " miliseconds.");
  return total;
};
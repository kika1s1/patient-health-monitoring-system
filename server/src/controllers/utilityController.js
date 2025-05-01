// @desc    Echo back the request body
// @route   POST /api/v1/utility/echo-data
// @access  Private (Requires API Key)
export const echoData = (req, res) => {
  res.status(200).json(req.body);
};

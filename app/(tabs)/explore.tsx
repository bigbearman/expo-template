import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Animated } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Define interfaces for our data types
interface DataSet {
  dataset1: number[];
  dataset2: number[];
}

export default function LineChartExample() {
  // Initialize with starting data
  const initialData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // purple line
        strokeWidth: 2
      },
      {
        data: [30, 50, 35, 60, 70, 85],
        color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`, // royal blue line
        strokeWidth: 2
      }
    ],
    legend: ['Product A', 'Product B']
  };

  // Current displayed data
  const [chartData, setChartData] = useState(initialData);
  
  // Target data (where we want to animate to)
  const [targetData, setTargetData] = useState<DataSet | null>(null);
  
  // Animation progress value
  const animationProgress = useRef(new Animated.Value(0)).current;
  
  // Previous data values for interpolation
  const prevDataRef = useRef({
    dataset1: [...initialData.datasets[0].data],
    dataset2: [...initialData.datasets[1].data]
  });

  // Function to generate random data points
  const generateRandomData = () => {
    return Array(6).fill(0).map(() => Math.floor(Math.random() * 100) + 10);
  };

  // Function to animate between data points
  const animateToNewData = useCallback((newDataset1: number[], newDataset2: number[]) => {
    // Store the current values as starting point
    prevDataRef.current = {
      dataset1: [...chartData.datasets[0].data],
      dataset2: [...chartData.datasets[1].data]
    };
    
    // Set the target data
    setTargetData({
      dataset1: newDataset1 || [],
      dataset2: newDataset2 || []
    });
    
    // Reset animation value
    animationProgress.setValue(0);
    
    // Start animation
    Animated.timing(animationProgress, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [chartData, animationProgress]);

  // Handle animation effect
  useEffect(() => {
    if (!targetData) return;
    
    // Setup listener for animation value changes
    const listener = animationProgress.addListener(({ value }) => {
      // Interpolate between previous and target values
      const interpolatedData1 = prevDataRef.current.dataset1.map((startVal, index) => {
        const endVal = targetData?.dataset1?.[index];
        return startVal + (endVal - startVal) * value;
      });
      
      const interpolatedData2 = prevDataRef.current.dataset2.map((startVal, index) => {
        const endVal = targetData?.dataset2?.[index];
        return startVal + (endVal - startVal) * value;
      });
      
      // Update chart with interpolated values
      setChartData(prevData => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: interpolatedData1
          },
          {
            ...prevData.datasets[1],
            data: interpolatedData2
          }
        ]
      }));
    });
    
    // Clean up listener
    return () => {
      animationProgress.removeListener(listener);
    };
  }, [targetData, animationProgress]);

  // Set up regular data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData1 = generateRandomData();
      const newData2 = generateRandomData();
      animateToNewData(newData1, newData2);
    }, 3000);

    return () => clearInterval(interval);
  }, [animateToNewData]);

  // Chart configuration
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726'
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monthly Sales Performance</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        yAxisSuffix="k"
        verticalLabelRotation={0}
        fromZero
      />
      <Text style={styles.description}>
        This chart shows the monthly sales performance for Products A and B over the first half of the year.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  description: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  }
}); 
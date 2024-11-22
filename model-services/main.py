import base64
import copy
import io
import time
from GUI_Functions import is_in_tolerance, occupancy_graph, pallet_graph, calculate_occupancy_no_setup_time, calculate_utilization, fitness_no_setup_time, calculate_occupancy, machine_utilization, product_flow
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import pandas as pd
from typing import Dict, Any
import json
import datetime
import tkinter as tk 
from tkinter import Toplevel
from io import BytesIO
from GA import *

import math
# Variables for def machine_util
input_list = None
process_steps = None
processing_times = None
product_paths = None
pallet_amount = None
setup_times_dict = None
best_solution_copy = None
pallets = None
best_pallet_config = None
val_list = None

app = FastAPI()


#Here is the function to run the entire program, i.e. when you have selected all the files and if you want rerun or not, you click on the "Run" button.
def run_optimization(excel_file, selected_setup_time, selected_csv_file, manual_input, pallet_var):
    global best_solution_copy, process_steps, processing_times, product_paths, input_list, pallet_amount, setup_times_dict, val_list, pallets, best_pallet_config, output_pallets #Here we have our global variables used by the genetic algorithm

    #Here we check all the fields and see if they are empty or not, if they are empty, the value is set to None (Ie if you selected a file and then just manually removed it from the field and did not click "Share")
    
    #If you have not selected an excel file, you will receive an error message
    if not excel_file:
        print("Please select the main Excel file (that includes the production line layout).")
        return

    #Load the Excel sheet as a pandas dataframe object
    process_steps_df = pd.read_excel(excel_file, sheet_name='Process_Steps')
    product_paths_df = pd.read_excel(excel_file, sheet_name='Product_Paths')
    processing_times_df = pd.read_excel(excel_file, sheet_name='Processing_Times')
    product_amount_df = pd.read_excel(excel_file, sheet_name='Product_Amount')
    pallet_amount_df = pd.read_excel(excel_file, sheet_name='Pallets')

    #Turn the Dataframe objects into dictionaries where the first bracket is the key and [] is the value associated with that key.
    product_amount_nostr = product_amount_df.set_index('Product')['Amount'].apply(math.ceil).to_dict()
    process_steps_nostr = process_steps_df.set_index('Step name')['Capacity'].to_dict()
    processing_times_nostr = processing_times_df.set_index('Step name').to_dict('index')
    product_paths_nostr = product_paths_df.set_index('Product').to_dict('list')
    pallet_amount_nostr = pallet_amount_df.set_index('pallet_group')['pallet_amount'].apply(math.ceil).to_dict()

    if selected_setup_time is not None:
        setup_time_excel_file = selected_setup_time
        setup_time_xls = pd.ExcelFile(setup_time_excel_file)
        setup_times_dict = {}

        # Iterate over all excel sheets
        for sheet_name in setup_time_xls.sheet_names:
            setup_time_df = setup_time_xls.parse(sheet_name, index_col=0)
            setup_times_dict[sheet_name.lower()] = {}

            for row in setup_time_df.index:
                for col in setup_time_df.columns:
                    key = (str(row) + str(col)).lower()
                    value = setup_time_df.loc[row, col]
                    if pd.notna(value):  # Check if the value is nan
                        setup_times_dict[sheet_name.lower()][key] = float(value)  # Convert the value to float if necessary

    #Function that iterates through all the keys in our dictionaries to make sure to remove spaces before processing steps in the excel file.
    #Also make sure that all strings are lowercase so that it doesn't matter if you wrote differently in the different sheets, e.g. (Vision control and vision control)
    def keys_lower(keys):
        if isinstance(keys, str):
            return keys.strip().lower()
        return keys

    #Here we set all keys in the dictionary to string so that any spaces in the excel file do not matter.
    product_amount = {str(keys_lower(key)): keys_lower(value) for key, value in product_amount_nostr.items()}
    process_steps = {str(keys_lower(key)): keys_lower(value) for key, value in process_steps_nostr.items()}
    processing_times = {str(keys_lower(key)): {str(keys_lower(inner_key)): keys_lower(inner_value) for inner_key, inner_value in value.items()} for key, value in processing_times_nostr.items()}
    product_paths = {str(keys_lower(key)): [keys_lower(item) for item in value] for key, value in product_paths_nostr.items()}
    pallet_amount = {str(keys_lower(key)): keys_lower(value) for key, value in pallet_amount_nostr.items()}

    # except Exception as E:
    #     print('end',f"ERROR: Please check the Excel file. {E}")
    #     return
    
    #Parameters, change at will
    population_size = 20
    num_generations = 1000 # change if it takes too long to run
    num_parents = 2
    mutation_rate = 0.05
    elitism_ratio = 0.1
    buffer_ratio = 1.2 #DO NOT CHANGE
    offspring_size = int((population_size - num_parents) * buffer_ratio)
    tolerance_percent = 0  # How much difference between the optimal value (inf palettes) and the desired value (5 = 5%)

    output_pallets = []
    generation_list = []
    best_fitness = math.inf
    best_solution = None
    best_solution_cleaned = ""
    generations_without_change = 0
    max_generations_without_change = 250
    

    #Here we have an if statement if you have selected a specific product sequence you want to try, if you have selected a product sequence then selected_csv_file will be True
    if selected_csv_file != None or manual_input != None:
        #We then try to read the file selected to verify that the structure is correct.
        try:
            if selected_csv_file != None:
                df = pd.read_excel(selected_csv_file)  
                csv_seq = df['Artikelnr'].to_list() #Here we choose which column we want to read from
            else: 
                csv_seq = manual_input

            sequence = csv_seq #Here we add csv_seq to sequence so that we can then remove any unnecessary characters and make everything lowercase
            if "," in sequence:
                input_list = [element.strip().strip("'").lower() for element in sequence.split(',')]
            else:
                input_list = [char.lower() for char in sequence]

            local_amount = {} #Here we create a dictionary where we add the specific amount of products that are in the selected sequence (It may be that this amount differs from the main excel file)
            for element in input_list:
                local_amount[element] = local_amount.get(element, 0) + 1
            population = [input_list.copy() for _ in range(population_size)] #Finally, we create a population where the amount depends on the population_size parameter
            print("Excel has been read correctly")
            time.sleep(0.5)
            print("Custom sequence has been read correctly")
            if selected_setup_time != None:
                print("Setup times have been read correctly")
            time.sleep(0.5)
        except Exception as E:
            print(f"Error processing CSV input: {E}") #If there is something strange about the entered sequence, you will get an error message
            print(f"Optimizing without a custom sequence...")
            local_amount = product_amount #Here we set local_amount to product_amount which is the amount specified in the main excel
            input_list = init_list(local_amount)
            population = init_population(local_amount, population_size) #Samt creates a population based on the information from the excel file and not from the own sequence you entered
    else:
        print("Excel has been read correctly")
        if selected_setup_time != None:
            print("Setup times have been read correctly")
        
        print("Optimizing without a custom sequence...") #If there should be something strange with the entered sequence, or if you run without your own entered sequence, you will receive this message
        local_amount = product_amount #Here we set local_amount to product_amount which is the amount specified in the main excel
        input_list = init_list(local_amount)
        population = init_population(local_amount, population_size) #Samt creates a population based on the information from the excel file and not from the own sequence you entered


    #If you clicked on the button that you want to find out the best number of palettes for your sequence, this will be executed
    if pallet_var == 1:
        global fitness_list
        pallets = pallet_amount
        for x in pallets:
            pallets[x] = 1

        try:
            if selected_setup_time is not None:
                initial_fitness = fitness(population, pallets, process_steps, processing_times, product_paths, setup_times_dict)
            else:
                initial_fitness = fitness_no_setup_time(population, pallets, process_steps, processing_times, product_paths)

        except Exception as E:
            print(f"Error processing input: {E}")
            local_amount = copy.deepcopy(product_amount)
            population = init_population(product_amount, population_size)


        # Parameters
        val_list = []
        improvement_threshold = 0.025  # difference in percentage, 0.05 = 5%

        best_overall_fitness = min([x[1] for x in initial_fitness])
        best_pallet_config = pallets.copy()

        for i in range(20):  # doesn't really matter which range, big enough that it has time to drive just a little
            pallets = best_pallet_config.copy()
            improved = False

            for j in pallets:
                # This is the usual main loop, found below.
                previous_amount = pallets[j]
                pallets[j] += 1

                best_fitness_list = []
                generation_list = []
                best_fitness = math.inf
                best_solution_copy = None

                offspring_size = int((population_size - num_parents) * buffer_ratio)
                for generation in range(num_generations):
                    generation_list.append(generation)

                    if selected_setup_time is not None:
                        fitness_population = fitness(population, pallets, process_steps, processing_times, product_paths, setup_times_dict)
                    else:
                        fitness_population = fitness_no_setup_time(population, pallets, process_steps, processing_times, product_paths)
                    
                    parents = [tournament_selection(fitness_population) for _ in range(num_parents)]
                    offspring = []

                    while len(offspring) < offspring_size:
                        parent1, parent2 = random.sample(parents, 2)
                        offspring.extend(crossover(parent1, parent2, offspring_size - len(offspring)))

                    offspring = adaptive_mutation(offspring, mutation_rate, generation, num_generations)
                    combined = parents + [child for child in offspring if enforce_quantity_constraint(child, local_amount)]

                    if len(combined) < population_size:
                        needed = population_size - len(combined)
                        combined.extend(init_population(local_amount, needed))

                    num_elites = int(population_size * elitism_ratio)
                    elites = sorted(fitness_population, key=lambda x: x[1])[:num_elites]
                    elites = [elite[0] for elite in elites]

                    population = elites + combined[:population_size - num_elites]

                    current_best_fitness = min([x[1] for x in fitness_population])
                    best_fitness_list.append(current_best_fitness)
                    if current_best_fitness < best_fitness:
                        best_fitness = current_best_fitness
                        best_solution_copy = copy.deepcopy(next(x[0] for x in fitness_population if x[1] == best_fitness))

                print(f"Iteration {i}, Pallet group {j}: {pallets}, Fitness: {best_fitness}")
                pallets_updated = pallets.copy()
                output_pallets.append(list((pallets_updated, best_fitness)))
                val_list.append(best_fitness)
                # Checks how much change
                if (best_overall_fitness - best_fitness) / best_overall_fitness > improvement_threshold:
                    best_overall_fitness = best_fitness
                    best_pallet_config = pallets.copy()
                    improved = True
                    print(f"Improvement found: New best fitness = {best_overall_fitness}")
                else:
                    # if not enough, revert to previous
                    pallets[j] = previous_amount

            # If none of the product groups (pallets) have improved, cancel
            if not improved:
                print("No significant improvement in this iteration. Stopping optimization.")
                break
    
        index = val_list.index(best_fitness)
        val_list = val_list[0:index + 1]
        print(f"Final optimized pallet configuration: {best_pallet_config}")
        print(f"Best overall fitness: {min(val_list)}")
        print(f"Fitness history: {val_list}")


    else:
        for generation in range(num_generations):
            generation_list.append(generation)
            if selected_setup_time is not None:
                fitness_population = fitness(population, pallet_amount, process_steps, processing_times, product_paths, setup_times_dict)
            else:
                fitness_population = fitness_no_setup_time(population, pallet_amount, process_steps, processing_times, product_paths)

            parents = [tournament_selection(fitness_population) for _ in range(num_parents)]
            offspring = []

            #As long as the length of the offspring is less than the offspring size, we create new offspring
            while len(offspring) < offspring_size:
                parent1, parent2 = random.sample(parents, 2)
                offspring.extend(crossover(parent1, parent2, offspring_size - len(offspring)))

            offspring = adaptive_mutation(offspring, mutation_rate, generation, num_generations)
            combined = parents + [child for child in offspring if enforce_quantity_constraint(child, local_amount)] #Here we add all offsprings and parents to a new population and check that all individuals follow restrictions, i.e. that there is the same amount of all products as we started with.

            #Here we make sure that we always have the right size of the new population, if it does not match, we create more individuals that are added to the new population
            if len(combined) < population_size:
                needed = population_size - len(combined)
                combined.extend(init_population(local_amount, needed))

            #Here we bring out elites based on our elitism_ratio and sort the population and save the best individuals for the next generation.
            num_elites = int(population_size * elitism_ratio)
            elites = sorted(fitness_population, key=lambda x: x[1])[:num_elites]
            elites = [elite[0] for elite in elites]

            population = elites + combined[:population_size - num_elites]

            current_best_fitness = min([x[1] for x in fitness_population])#We save down the best sequence and its fitness value

            #If this generation's best fitness is better than previously measured fitness values, it becomes the new global best fitness.
            if current_best_fitness < best_fitness:
                best_fitness = current_best_fitness
                best_solution = next(x[0] for x in fitness_population if x[1] == best_fitness)
                best_solution_copy = copy.deepcopy(best_solution)
                generations_without_change = 0
            else:
                generations_without_change += 1

            if generations_without_change > max_generations_without_change:
                for individual in population:
                    random.shuffle(individual)
                generations_without_change = 0    


        #For loop loops through the best solution and saves it without any special characters
        for i in best_solution_copy:
            best_solution_cleaned += i
            best_solution_cleaned += " "

        #This function prints out all the information the user might want to see
        if selected_setup_time is not None:
            return print_statistics(input_list, best_solution_copy, process_steps, processing_times, product_paths, best_solution_cleaned, setup_times_dict, tolerance_percent, best_fitness)
        else:
            return print_statistics_no_setup_time(input_list, best_solution_copy, process_steps, processing_times, product_paths, best_solution_cleaned, tolerance_percent, best_fitness, None, pallet_amount)

       
def print_statistics(input_list, best_solution_copy, process_steps, processing_times, product_paths, best_solution_cleaned, setup_times_dict, tolerance_percent, best_fitness):
    return {
        "fake": "fake"
    }

#This function retrieves all statistics and prints it out in the output box (It does the same thing as the machine occupancy graphs but skips plotting the graph)
def print_statistics_no_setup_time(input_list, best_solution, process_steps, processing_times, product_paths, best_solution_cleaned, tolerance_percent, best_fitness, selected_setup_time, pallet_amount):

    print(f"input_list: {input_list}")
    print(f"best_solution: {best_solution}")
    print(f"process_steps: {process_steps}")
    print(f"processing_times: {processing_times}")
    print(f"best_solution_cleaned: {best_solution_cleaned}")
    print(f"tolerance_percent: {tolerance_percent}")
    print(f"best_fitness: {best_fitness}")
    print(f"pallet_amount: {pallet_amount}")

    try:
        initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
    except Exception as E:
        error_result = {
            "error": f"Error calculating inital occupancy: {str(E)}"
        }
        return json.dumps(error_result)
    
    try:
        optimized_occupancy = calculate_occupancy_no_setup_time(best_solution, process_steps, processing_times, product_paths, pallet_amount)   
    except Exception as E:
        error_result = {
            "error": f"Error calculating optimized occupancy: {str(E)}"
        }
        return json.dumps(error_result)

    try:
       initial_utilization, initial_total_time = calculate_utilization(initial_occupancy)
    except Exception as E:
        error_result = {
            "error": f"Error calculating initial utilization and initial total time: {str(E)}"
        }
        return json.dumps(error_result)    
    try:
        optimized_utilization, optimized_total_time = calculate_utilization(optimized_occupancy)
    except Exception as E:
        error_result = {
            "error": f"Error calculating optimized utilization optimized total time: {str(E)}"
        }
        return json.dumps(error_result)    
        
    time_improvement = initial_total_time - optimized_total_time
    percentage_improvement = (time_improvement / initial_total_time) * 100
        
    avg_initial_utilization = sum(initial_utilization.values()) / len(initial_utilization)
    avg_optimized_utilization = sum(optimized_utilization.values()) / len(optimized_utilization)

    try:
       minimal_pallet_amount = find_minimal_pallet_amount(best_solution, best_fitness, tolerance_percent, selected_setup_time, pallet_amount, setup_times_dict= None, )
    except Exception as E:
        error_result = {
            "error": f"Error calculating minimal pallet amount : {str(E)}"
        }
        return json.dumps(error_result)  
     
    try:
        pallet_fitness = fitness_no_setup_time([best_solution], minimal_pallet_amount, process_steps, processing_times, product_paths)
    except Exception as E:
        error_result = {
            "error": f"Error calculating pallet_fitness : {str(E)}"
        }
        return json.dumps(error_result)  
        
 


    print(f"Initial total production time: {initial_total_time:.2f} ")
    print(f"Optimized total production time: {optimized_total_time:.2f} ")
    print(f"Time improvement: {time_improvement:.2f} ({percentage_improvement:.2f}%) ")
    print(f"Average initial total machine utilization: {avg_initial_utilization:.2f}% ")
    print(f"Average optimized total machine utilization: {avg_optimized_utilization:.2f}% ")
    print(f"Utilization improvement: {avg_optimized_utilization - avg_initial_utilization:.2f}%")
    print(f"Maximum amount of pallets used for this sequence:{minimal_pallet_amount}")
    print(f"The amount of pallets defined in the Excel:{pallet_amount}")
    print(f"Total time with optimized amount of pallets: {pallet_fitness[0][1]}")
    print(f"Total time with the amount of pallets in the Excel: {best_fitness}")
    print(f"The best sequence of products: {best_solution_cleaned}")

        # Prepare the data for JSON output
    result =  {
        "initial_total_production_time": round(initial_total_time, 2),
        "optimized_total_production_time": round(optimized_total_time, 2),
        "time_improvement":  round(time_improvement, 2),
        "percentage_improvement": round(percentage_improvement, 2),
        "average_initial_total_machine_utilization": round(avg_initial_utilization, 2),
        "average_optimized_total_machine_utilization": round(avg_optimized_utilization, 2),
        "utilization_improvement": round(avg_optimized_utilization - avg_initial_utilization, 2),
        "maximum_pallets_used": minimal_pallet_amount,
        "pallets_defined_in_Excel:": pallet_amount,
        "total_time_with_optimized_pallets": round(pallet_fitness[0][1], 2),
        "total_time_with_excel_pallets": best_fitness,
        "best_sequence_of_products": best_solution_cleaned,
        "graphs": machine_util(input_list, best_solution_copy, process_steps, processing_times,  product_paths, pallets, pallet_amount, setup_times_dict, selected_setup_time, 0)
    }

    return result


def find_minimal_pallet_amount(best_solution, best_fitness, tolerance_percent, selected_setup_time, pallet_amount, setup_times_dict):
    # Starts palettes with high values
    local_pallet_amount = copy.deepcopy(pallet_amount) 
    print(f"find_minimal_pallet_amount funct: {local_pallet_amount}")
    #for i in local_pallet_amount: #This is necessary IF the values ​​in excel are odef/inf
        #local_pallet_amount[i] = 1000 #Sets the initial values

    # A "binary search" algorithm to find the smallest set of groups
    # starts with low and high value, (1 and 1000) and palette group (E.g. palette group a,b,c)
    # calculates if the middle value of both numbers is the same fitness as with infinite palettes
    # If the value is reasonable, try a smaller value :high = mid
    # if it's out of range try a higher value :low = mid + 1 
    # Do this until low = high, which returns the minsat value
    def binary_search(group, low, high):
        while low < high:
            mid = (low + high) // 2
            temp_pallet_amount = copy.deepcopy(local_pallet_amount)
            temp_pallet_amount[group] = mid
            
            #Calculates fitness value using the current mean value
            if selected_setup_time is not None:
                pallet_fitness = fitness([best_solution], temp_pallet_amount, process_steps, processing_times, product_paths, setup_times_dict)
                current_fitness_val = pallet_fitness[0][1]
            else:
                pallet_fitness = fitness_no_setup_time([best_solution], temp_pallet_amount, process_steps, processing_times, product_paths)
                current_fitness_val = pallet_fitness[0][1]

            #checks if fitness is within okay range
            if is_in_tolerance(best_fitness, current_fitness_val, tolerance_percent):
                high = mid  # tries to find smaller values
            else:
                low = mid + 1  # increase the value
        return low 

    # Find the minimum amount per group
    for group in local_pallet_amount.keys():
        local_pallet_amount[group] = binary_search(group, 1, local_pallet_amount[group]) #Insert pallet group, "low-number" (1) and the high pallet amount for the group
    return local_pallet_amount   

def machine_util(input_list, best_solution_copy, process_steps, processing_times,  product_paths, pallets, pallet_amount, setup_times_dict, selected_setup_time, pallet_var):
    try: 
        # Calculate machine occupancy values
        if selected_setup_time is not None:
            if pallet_var == 1:
                initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
                optimized_occupancy = calculate_occupancy(best_solution_copy, process_steps, processing_times, product_paths, pallets, setup_times_dict)
            else:
                initial_occupancy = calculate_occupancy(input_list, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
                optimized_occupancy = calculate_occupancy(best_solution_copy, process_steps, processing_times, product_paths, pallet_amount, setup_times_dict)
        else:
            if pallet_var == 1:
                initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
                optimized_occupancy = calculate_occupancy_no_setup_time(best_solution_copy, process_steps, processing_times, product_paths, pallets)
            else:
                initial_occupancy = calculate_occupancy_no_setup_time(input_list, process_steps, processing_times, product_paths, pallet_amount)
                optimized_occupancy = calculate_occupancy_no_setup_time(best_solution_copy, process_steps, processing_times, product_paths, pallet_amount)
        
        # Save all graphs
        fig1 = occupancy_graph(initial_occupancy, optimized_occupancy)
        fig2, utilization_data = machine_utilization(initial_occupancy, optimized_occupancy)
        fig3 = product_flow(best_solution_copy, product_paths, processing_times)

        fig_list = [fig1, fig2, fig3]

        print(f"\nOccupancy graph: {fig1}")
        fig2.show()
        
        #Do save graph to JSON logic
        
       
        graphs = {
            "occupancy_graph": fig1,
            "machine_utilization": fig2,
            "product_flow": fig3,
        }

        if pallet_var == 1:
            fig4 = pallet_graph(best_pallet_config, val_list)
            fig_list.append(fig4)
            graphs['pallet_graph'] = fig4

        graphsBase64 = {}
        buffer = io.BytesIO()
        for graph in graphs.keys():
            fig = graphs.get(graph)
            fig.savefig(buffer, format='png')
            buffer.seek(0)
            graphsBase64[graph] = base64.b64encode(buffer.getvalue()).decode('utf-8')
            buffer.flush()

      
        return graphsBase64
    except Exception as E:
        print(f"Can't show graph because no optimization was done. {E}")

@app.post("/optimize")
async def optimize(file: UploadFile = File(...)) -> JSONResponse:
    """
    Endpoint to process the uploaded Excel file and return optimization results.
    """
    try:
        # Step 1: Read the uploaded Excel file into a DataFrame
        excel = await file.read()

        # Step 2: Run optimization logic
        pallet_var = 0
        optimized_data = run_optimization(excel, None, None, None, pallet_var)

        return JSONResponse(content=optimized_data)
    
    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )